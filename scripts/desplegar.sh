#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Despliegue de Impresos Trujillo
#
#   scripts/desplegar.sh <commit>     despliega ese commit exacto
#   scripts/desplegar.sh --volver     vuelve al commit anterior
#
# Lo ejecuta el CI en el VPS (con el SHA que pasó las pruebas) y también se
# puede lanzar a mano. Antes de tocar nada comprueba que el commit existe.
#
# Garantías que da, y que antes no existían:
#
#   1. Se despliega el commit VALIDADO, no lo que esté en `main` en ese
#      momento: se hace `git reset --hard <sha>` en vez de `git pull`.
#   2. Antes de las migraciones se guarda un respaldo del día. Si el respaldo
#      falla, el despliegue se detiene: es la red de seguridad, no un extra.
#   3. Si el smoke test falla, se vuelve solo al commit anterior (código,
#      imagen y contenedores) y se avisa. Antes quedaba arriba la versión rota.
#   4. Queda registrado qué commit está desplegado, para poder volver a mano.
#
# Para ensayar la vuelta atrás sin romper nada:
#   FORZAR_FALLO_SMOKE=1 scripts/desplegar.sh $(git rev-parse HEAD)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

FUENTE="${HOME}/data/repos/impresos-trujillo"
DEPLOY="${HOME}/data/deploy/impresos"
VOLUMEN_CAPTURAS="${HOME}/data/volumes/impresos/comprobantes"
ESTADO="${DEPLOY}/despliegue.estado"
LOG="${DEPLOY}/despliegues.log"

paso() { echo; echo "── $* ──"; }
aviso() { echo "   ⚠ $*"; }
error() { echo "   ✗ $*" >&2; }

[ -d "${DEPLOY}" ] || { error "No existe ${DEPLOY}: este script se ejecuta en el servidor."; exit 1; }
[ -d "${FUENTE}" ] || { error "No existe ${FUENTE}."; exit 1; }

# ── Utilidades ───────────────────────────────────────────────────────────────

commit_desplegado() {
  # Lo que está desplegado ahora: primero el registro, si no el HEAD del clon.
  # Ojo con `grep`: el archivo tiene tres líneas (commit, fecha, anterior) y
  # cortarlas todas devolvería un SHA con saltos de línea que git rechaza.
  if [ -f "${ESTADO}" ]; then
    grep -E '^commit=' "${ESTADO}" 2>/dev/null | cut -d= -f2 || true
  else
    git -C "${FUENTE}" rev-parse HEAD 2>/dev/null || true
  fi
}

fijar_codigo() {
  local sha="$1"
  paso "Código: fijar el commit ${sha:0:8}"
  git -C "${FUENTE}" fetch --quiet --all --tags
  # reset --hard y no pull: se despliega EXACTAMENTE el commit probado, sin
  # depender de en qué punto esté la rama cuando entra la conexión.
  if ! git -C "${FUENTE}" reset --hard "${sha}" >/dev/null 2>&1; then
    error "El commit ${sha} no existe en el repositorio."
    exit 1
  fi
  echo "   ✓ ${FUENTE} en $(git -C "${FUENTE}" rev-parse --short HEAD) — $(git -C "${FUENTE}" log -1 --format=%s)"
}

respaldar() {
  paso "Respaldo: copia antes de tocar la base"
  if [ ! -x "${FUENTE}/backups/backup.sh" ]; then
    error "No está ${FUENTE}/backups/backup.sh: sin respaldo no se migra."
    exit 1
  fi
  if ! "${FUENTE}/backups/backup.sh" | grep -q "RESULTADO: OK"; then
    error "El respaldo falló (ver ${HOME}/data/backups/impresos/backup.log)."
    error "No se despliega: migrar sin copia buena es lo que no se puede deshacer."
    exit 1
  fi
  echo "   ✓ paquete del día listo"
}

preparar_volumen() {
  paso "Capturas: preparar el volumen"
  mkdir -p "${VOLUMEN_CAPTURAS}"
  # La API corre como el usuario `app` de la imagen (uid 100) y este proceso no
  # tiene sudo, así que el dueño se ajusta desde un contenedor.
  docker run --rm -v "${VOLUMEN_CAPTURAS}:/datos" alpine:3 chown -R 100:101 /datos >/dev/null 2>&1 || true
  echo "   ✓ ${VOLUMEN_CAPTURAS}"
}

construir_y_levantar() {
  paso "Construir y levantar"
  cd "${DEPLOY}"
  # Se construye ANTES de migrar: las migraciones viven dentro de la imagen, así
  # que un `run` sobre la imagen vieja aplicaría las migraciones viejas.
  docker compose build api
  docker compose run --rm api python -m alembic upgrade head
  # --wait no devuelve el control hasta que los tres pasan su healthcheck.
  docker compose up -d --build --wait --wait-timeout 180
  docker compose ps
}

smoke_test() {
  paso "Smoke test"
  local dominio codigo
  dominio="$(grep -E '^IMPRESOS_DOMAIN=' "${DEPLOY}/.env" | cut -d= -f2)"

  if [ "${FORZAR_FALLO_SMOKE:-0}" = "1" ]; then
    aviso "FORZAR_FALLO_SMOKE=1: se simula el fallo para comprobar la vuelta atrás."
    return 1
  fi

  # Se reintenta a propósito: `up -d` deja el contenedor arriba en menos de un
  # segundo, pero Traefik tarda unos segundos más en leer sus etiquetas. Una
  # consulta inmediata devuelve 404 y tumbaría un despliegue correcto.
  # -k es obligatorio: se conecta a 127.0.0.1 mandando el Host del dominio.
  codigo=000
  for intento in $(seq 1 30); do
    codigo="$(curl -sk -o /dev/null -w '%{http_code}' -H "Host: ${dominio}" https://127.0.0.1/health || echo 000)"
    [ "${codigo}" = "200" ] && break
    echo "   intento ${intento}/30 -> ${codigo}"
    sleep 4
  done
  if [ "${codigo}" != "200" ]; then
    error "GET /health -> ${codigo}: la aplicación no responde por el dominio."
    return 1
  fi
  echo "   ✓ /health -> 200"

  # La página: si nginx no sirve la SPA, el usuario ve un error.
  codigo="$(curl -sk -o /dev/null -w '%{http_code}' -H "Host: ${dominio}" https://127.0.0.1/ || echo 000)"
  if [ "${codigo}" != "200" ]; then
    error "GET / -> ${codigo}: el frontend no se está sirviendo."
    return 1
  fi
  echo "   ✓ / -> 200 (frontend)"

  # La API con sus rutas: sin sesión debe responder 401, no 404. Un 404 aquí
  # significa que la aplicación no cargó sus rutas (import roto, migración mal
  # aplicada) y es justo lo que el healthcheck no detecta.
  codigo="$(curl -sk -o /dev/null -w '%{http_code}' -H "Host: ${dominio}" https://127.0.0.1/api/auth/me || echo 000)"
  if [ "${codigo}" != "401" ]; then
    error "GET /api/auth/me -> ${codigo} (se esperaba 401): la API no está en pie."
    return 1
  fi
  echo "   ✓ /api/auth/me -> 401 (la API responde y protege)"
  return 0
}

guardar_estado() {
  local sha="$1"
  echo "commit=${sha}" > "${ESTADO}"
  echo "fecha=$(date -Is)" >> "${ESTADO}"
  echo "anterior=${2:-}" >> "${ESTADO}"
}

registrar() {
  echo "$(date -Is) | ${1} | commit ${2:0:8} | ${3}" >> "${LOG}"
}

# ── Vuelta atrás ─────────────────────────────────────────────────────────────
volver_a() {
  local sha="$1" motivo="${2:-a mano}"
  [ -n "${sha}" ] || { error "No hay commit anterior al que volver."; return 1; }

  aviso "VOLVIENDO al commit ${sha:0:8} (${motivo})"
  fijar_codigo "${sha}"
  construir_y_levantar
  # El smoke se comprueba de verdad siempre: si el ensayo venía con
  # FORZAR_FALLO_SMOKE=1, la vuelta atrás no tendría forma de pasar.
  if FORZAR_FALLO_SMOKE=0 smoke_test; then
    guardar_estado "${sha}" ""
    registrar "vuelta atras OK" "${sha}" "${motivo}"
    aviso "El sistema quedó operando con ${sha:0:8}. Revisa qué pasó antes de reintentar."
    return 0
  fi
  error "La vuelta atrás tampoco pasó el smoke test: el sistema necesita atención manual."
  registrar "vuelta atras FALLIDA" "${sha}" "${motivo}"
  return 1
}

# ── Flujo principal ──────────────────────────────────────────────────────────

if [ "${1:-}" = "--volver" ]; then
  ANTERIOR="$(grep -E '^anterior=' "${ESTADO}" 2>/dev/null | cut -d= -f2 || true)"
  [ -n "${ANTERIOR}" ] || { error "No hay commit anterior registrado en ${ESTADO}."; exit 1; }
  volver_a "${ANTERIOR}" "solicitado a mano"
  exit $?
fi

SHA="${1:-}"
if [ -z "${SHA}" ]; then
  error "Falta el commit. Uso: scripts/desplegar.sh <commit> | --volver"
  exit 2
fi

ANTERIOR="$(commit_desplegado)"
echo "════════════════════════════════════════════════════════════════════"
echo " Despliegue — $(date -Is)"
echo "   commit a desplegar: ${SHA:0:12}"
echo "   commit en marcha:   ${ANTERIOR:0:12}"
echo "════════════════════════════════════════════════════════════════════"

fijar_codigo "${SHA}"
respaldar
preparar_volumen
construir_y_levantar

if smoke_test; then
  guardar_estado "$(git -C "${FUENTE}" rev-parse HEAD)" "${ANTERIOR}"
  registrar "despliegue OK" "${SHA}" "anterior ${ANTERIOR:0:8}"
  echo
  echo "RESULTADO: OK — ${SHA:0:8} en producción."
  exit 0
fi

echo
error "El smoke test falló con el commit nuevo."
registrar "despliegue FALLIDO" "${SHA}" "smoke test"
if volver_a "${ANTERIOR}" "smoke test falló con ${SHA:0:8}"; then
  exit 1
fi
exit 1
