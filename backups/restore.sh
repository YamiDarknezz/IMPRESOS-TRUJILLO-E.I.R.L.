#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Restauración de una copia de seguridad de Impresos Trujillo
#
#   backups/restore.sh PAQUETE [opciones]
#
#   PAQUETE   ruta al .tar.gz (o a la carpeta) que generó backups/backup.sh
#
# ⚠️  ESTO REEMPLAZA LOS DATOS ACTUALES. Restaura la base de datos y las
#     capturas sobre el sistema en marcha, borrando antes lo que haya. Se usa
#     cuando hay que recuperar el sistema tras una pérdida, no para mirar qué
#     traía un paquete (para eso, añade --solo-verificar).
#
# Opciones:
#   --si                 no pedir confirmación (para un guion automatizado)
#   --solo-verificar     abrir el paquete y comparar con el estado actual, sin tocar nada
#   --solo-base          restaurar únicamente la base de datos
#   --solo-capturas      restaurar únicamente las capturas de pago
#   --capturas DIR       destino de las capturas (por defecto el volumen del VPS)
#   --contenedor NOMBRE  contenedor de PostgreSQL destino (por defecto impresos-db);
#                        sirve para ensayar una restauración en un entorno aparte
#
# Ver backups/README.md para el procedimiento completo.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

DESPLIEGUE="${HOME}/data/deploy/impresos"
VOLUMEN_CAPTURAS="${HOME}/data/volumes/impresos/comprobantes"
CONTENEDOR_DB="impresos-db"
CONFIRMAR=1
MODO="todo"

PAQUETE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --si) CONFIRMAR=0; shift ;;
    --solo-verificar) MODO="verificar"; shift ;;
    --solo-base) MODO="base"; shift ;;
    --solo-capturas) MODO="capturas"; shift ;;
    --capturas) VOLUMEN_CAPTURAS="$2"; shift 2 ;;
    --contenedor) CONTENEDOR_DB="$2"; shift 2 ;;
    -h|--help) sed -n '2,22p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    -*) echo "Opción no reconocida: $1" >&2; exit 2 ;;
    *) PAQUETE="$1"; shift ;;
  esac
done

if [ -z "${PAQUETE}" ]; then
  echo "Falta la ruta del paquete. Uso: backups/restore.sh PAQUETE [opciones]" >&2
  exit 2
fi
if [ ! -e "${PAQUETE}" ]; then
  echo "No existe: ${PAQUETE}" >&2
  exit 2
fi

# ── Abrir el paquete en un directorio de trabajo ─────────────────────────────
TRABAJO="$(mktemp -d)"
trap 'rm -rf "${TRABAJO}"' EXIT

if [ -d "${PAQUETE}" ]; then
  cp -a "${PAQUETE}/." "${TRABAJO}/"
else
  tar -xzf "${PAQUETE}" -C "${TRABAJO}"
  # El paquete trae una carpeta dentro (impresos-AAAA-MM-DD).
  if [ ! -f "${TRABAJO}/base.dump" ]; then
    INTERNO="$(find "${TRABAJO}" -maxdepth 1 -mindepth 1 -type d | head -1)"
    [ -n "${INTERNO}" ] && mv "${INTERNO}"/* "${TRABAJO}/" && rmdir "${INTERNO}"
  fi
fi

echo "════════════════════════════════════════════════════════════════════"
echo " Restauración — $(date -Is)"
echo "════════════════════════════════════════════════════════════════════"
echo "Paquete: ${PAQUETE}"
echo
echo "── Lo que trae el paquete ──"
cat "${TRABAJO}/MANIFIESTO.txt" 2>/dev/null || echo "  (sin manifiesto: paquete de una versión anterior)"
echo "  base.dump:        $(du -h "${TRABAJO}/base.dump" 2>/dev/null | cut -f1 || echo 'AUSENTE')"
CAPTURAS_TAR="$(tar -tzf "${TRABAJO}/comprobantes.tar.gz" 2>/dev/null | grep -c '[^/]$' || true)"
echo "  capturas:         ${CAPTURAS_TAR:-0} archivo(s)"

if [ ! -s "${TRABAJO}/base.dump" ] && [ "${MODO}" != "capturas" ]; then
  echo "✗ El paquete no trae base.dump: no hay nada que restaurar." >&2
  exit 1
fi

# ── Credenciales destino ─────────────────────────────────────────────────────
ENV_DESPLIEGUE="${DESPLIEGUE}/.env"
if [ -r "${ENV_DESPLIEGUE}" ]; then
  POSTGRES_DB="$(grep -E '^POSTGRES_DB=' "${ENV_DESPLIEGUE}" | head -1 | cut -d= -f2-)"
  POSTGRES_USER="$(grep -E '^POSTGRES_USER=' "${ENV_DESPLIEGUE}" | head -1 | cut -d= -f2-)"
fi
POSTGRES_DB="${POSTGRES_DB:-impresos}"
POSTGRES_USER="${POSTGRES_USER:-impresos}"

# ── Modo: solo verificar ─────────────────────────────────────────────────────
if [ "${MODO}" = "verificar" ]; then
  echo
  echo "── Comparación con el sistema en marcha (no se toca nada) ──"
  # El -i es imprescindible: sin él docker no conecta la entrada estándar y el
  # dump llega vacío (parecería un paquete ilegible).
  docker exec -i "${CONTENEDOR_DB}" pg_restore --list < "${TRABAJO}/base.dump" >/dev/null 2>&1 \
    && echo "  ✓ el dump es legible y se puede restaurar" \
    || echo "  ✗ el dump NO se puede leer con pg_restore"
  echo "  órdenes en la base actual:  $(docker exec "${CONTENEDOR_DB}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc 'SELECT count(*) FROM ordenes' 2>/dev/null || echo '-')"
  echo "  órdenes según el paquete:   $(grep -E '^Órdenes:' "${TRABAJO}/MANIFIESTO.txt" 2>/dev/null | awk '{print $2}' || echo '-')"
  echo "  capturas en el volumen:     $(find "${VOLUMEN_CAPTURAS}" -type f 2>/dev/null | wc -l)"
  echo "  capturas según el paquete:  $(grep -E '^Capturas:' "${TRABAJO}/MANIFIESTO.txt" 2>/dev/null | awk '{print $2}' || echo '-')"
  exit 0
fi

# ── Confirmación ─────────────────────────────────────────────────────────────
if [ "${CONFIRMAR}" -eq 1 ]; then
  echo
  echo "⚠️  Se van a REEMPLAZAR los datos actuales de la base '${POSTGRES_DB}'"
  echo "    (${CONTENEDOR_DB}) y, si el modo lo incluye, las capturas de ${VOLUMEN_CAPTURAS}."
  printf "¿Continuar? (escribe SI): "
  read -r RESPUESTA
  [ "${RESPUESTA}" = "SI" ] || { echo "Cancelado."; exit 1; }
fi

# ── Restaurar la base ────────────────────────────────────────────────────────
if [ "${MODO}" = "todo" ] || [ "${MODO}" = "base" ]; then
  echo
  echo "── Base de datos ──"
  # La base se RECREA en vez de restaurar encima. Dos razones:
  #   1. Un restore sobre una base con datos viejos deja mezclas que nadie ve.
  #   2. pg_restore con --clean y el dump por entrada estándar no restaura nada
  #      (comprobado: se queda en "no such file or directory" y sale con error).
  # El dump se copia dentro del contenedor para que pg_restore lo lea de disco.
  docker cp "${TRABAJO}/base.dump" "${CONTENEDOR_DB}:/tmp/base.dump" >/dev/null

  docker exec "${CONTENEDOR_DB}" psql -U "${POSTGRES_USER}" -d postgres -q \
    -c "DROP DATABASE IF EXISTS ${POSTGRES_DB} WITH (FORCE)" \
    -c "CREATE DATABASE ${POSTGRES_DB} OWNER ${POSTGRES_USER}" \
    || { echo "  ✗ no se pudo recrear la base ${POSTGRES_DB}"; docker exec "${CONTENEDOR_DB}" rm -f /tmp/base.dump; exit 1; }

  docker exec "${CONTENEDOR_DB}" pg_restore -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
    --no-owner --no-privileges /tmp/base.dump > /dev/null 2>"${TRABAJO}/restore.err" || true
  docker exec "${CONTENEDOR_DB}" rm -f /tmp/base.dump

  TABLAS="$(docker exec "${CONTENEDOR_DB}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc \
    "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'" | tr -d ' ')"
  if [ "${TABLAS:-0}" -lt 10 ]; then
    echo "  ✗ la restauración dejó ${TABLAS} tabla(s): revisa el paquete"
    head -5 "${TRABAJO}/restore.err" | sed 's/^/      /'
    exit 1
  fi
  echo "  ✓ base recreada y restaurada (${TABLAS} tablas)"

  ERRORES="$(grep -c "error:" "${TRABAJO}/restore.err" 2>/dev/null || true)"
  if [ "${ERRORES:-0}" -gt 0 ]; then
    # Algún aviso por objetos que ya no existen es normal; si hay errores de
    # verdad, se enseñan para poder juzgarlos.
    echo "  ⚠ pg_restore reportó ${ERRORES} error(es); los primeros:"
    grep "error:" "${TRABAJO}/restore.err" | head -5 | sed 's/^/      /'
  fi
  echo "  órdenes restauradas: $(docker exec "${CONTENEDOR_DB}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc 'SELECT count(*) FROM ordenes' | tr -d ' ')"
fi

# ── Restaurar las capturas ───────────────────────────────────────────────────
if [ "${MODO}" = "todo" ] || [ "${MODO}" = "capturas" ]; then
  echo
  echo "── Capturas de pago ──"
  if [ ! -f "${TRABAJO}/comprobantes.tar.gz" ]; then
    echo "  · el paquete no trae capturas"
  else
    mkdir -p "${VOLUMEN_CAPTURAS}"
    # Con un contenedor para que los archivos queden con el dueño que espera la
    # API (uid 100), no con el del usuario que restaura.
    docker run --rm -v "${VOLUMEN_CAPTURAS}:/destino" -v "${TRABAJO}:/origen:ro" alpine:3 \
      sh -c 'tar -xzf /origen/comprobantes.tar.gz -C /destino && chown -R 100:101 /destino'
    echo "  ✓ capturas restauradas: $(find "${VOLUMEN_CAPTURAS}" -type f | wc -l) archivo(s)"
  fi
fi

# ── Comprobación final ───────────────────────────────────────────────────────
echo
echo "── Comprobación ──"
ESPERADAS="$(grep -E '^Órdenes:' "${TRABAJO}/MANIFIESTO.txt" 2>/dev/null | awk '{print $2}')"
ACTUALES="$(docker exec "${CONTENEDOR_DB}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc 'SELECT count(*) FROM ordenes' 2>/dev/null | tr -d ' ' || echo '-')"
CAPTURAS_PAQUETE="$(grep -E '^Capturas:' "${TRABAJO}/MANIFIESTO.txt" 2>/dev/null | awk '{print $2}')"
CAPTURAS_ACTUALES="$(find "${VOLUMEN_CAPTURAS}" -type f 2>/dev/null | wc -l)"

echo "  órdenes:  paquete ${ESPERADAS:-?} / restauradas ${ACTUALES}"
echo "  capturas: paquete ${CAPTURAS_PAQUETE:-?} / restauradas ${CAPTURAS_ACTUALES}"

if [ -n "${ESPERADAS}" ] && [ "${ESPERADAS}" != "${ACTUALES}" ]; then
  echo
  echo "RESULTADO: REVISAR — el número de órdenes no coincide con el paquete."
  exit 1
fi

echo
echo "RESULTADO: OK"
echo "Falta un paso: la aplicación sigue con la sesión abierta sobre los datos"
echo "viejos. Reiníciala para que todo quede consistente:"
echo "    cd ${DESPLIEGUE} && docker compose restart api web"
