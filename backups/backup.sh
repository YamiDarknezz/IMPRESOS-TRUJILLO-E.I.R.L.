#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Copia de seguridad de Impresos Trujillo
#
#   backups/backup.sh [opciones]
#
# Genera UN paquete por día con todo lo que hace falta para levantar el sistema
# desde cero: la base de datos, las capturas de pago y la configuración del
# despliegue. No respalda el código (ese vive en Git) ni las imágenes de Docker
# (se reconstruyen desde el repositorio).
#
# REGLA DE ORO: un paso crítico NUNCA se convierte en un aviso silencioso. Si la
# base o las capturas no se pudieron copiar, el script termina en error y dice
# exactamente qué falta. Un paquete incompleto que dice "OK" es peor que un
# error, porque se descubre el día que hay que restaurar.
#
# Opciones:
#   --destino DIR       dónde dejar los paquetes (por defecto ~/data/backups/impresos)
#   --retencion DIAS    días de paquetes que se conservan (por defecto 30)
#   --capturas DIR      dónde están las capturas de pago (por defecto el volumen del VPS)
#   --sin-config        no incluir el .env del despliegue (el paquete lleva secretos)
#   --sin-empaquetar    dejar el paquete como carpeta en vez de .tar.gz
#
# Ver backups/README.md para el proceso completo y la restauración.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Valores por defecto (los del VPS; todo se puede sobreescribir) ───────────
DESPLIEGUE="${HOME}/data/deploy/impresos"
VOLUMEN_CAPTURAS="${HOME}/data/volumes/impresos/comprobantes"
DESTINO="${HOME}/data/backups/impresos"
CONTENEDOR_DB="impresos-db"
RETENCION_DIAS=30
INCLUIR_CONFIG=1
EMPAQUETAR=1

while [ $# -gt 0 ]; do
  case "$1" in
    --destino) DESTINO="$2"; shift 2 ;;
    --capturas) VOLUMEN_CAPTURAS="$2"; shift 2 ;;
    --retencion) RETENCION_DIAS="$2"; shift 2 ;;
    --sin-config) INCLUIR_CONFIG=0; shift ;;
    --sin-empaquetar) EMPAQUETAR=0; shift ;;
    -h|--help) sed -n '2,25p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Opción no reconocida: $1" >&2; exit 2 ;;
  esac
done

FECHA="$(date +%F)"
PAQUETE="${DESTINO}/impresos-${FECHA}"
ARCHIVO="${DESTINO}/impresos-${FECHA}.tar.gz"
LOG="${DESTINO}/backup.log"

mkdir -p "${DESTINO}"
exec > >(tee -a "${LOG}") 2>&1

FALLOS=0
anotar_fallo() { echo "  ✗ $1"; FALLOS=$((FALLOS + 1)); }

echo "════════════════════════════════════════════════════════════════════"
echo " Copia de seguridad — $(date -Is)"
echo "════════════════════════════════════════════════════════════════════"

# ── 1. Credenciales de la base ───────────────────────────────────────────────
# Se leen del .env del despliegue (fuente de verdad) y SOLO las dos variables que
# hacen falta para el dump: el resto del .env no sale de aquí.
ENV_DESPLIEGUE="${DESPLIEGUE}/.env"
if [ ! -r "${ENV_DESPLIEGUE}" ]; then
  echo "✗ No se puede leer ${ENV_DESPLIEGUE}: sin credenciales no hay copia válida." >&2
  exit 1
fi
POSTGRES_DB="$(grep -E '^POSTGRES_DB=' "${ENV_DESPLIEGUE}" | head -1 | cut -d= -f2-)"
POSTGRES_USER="$(grep -E '^POSTGRES_USER=' "${ENV_DESPLIEGUE}" | head -1 | cut -d= -f2-)"
if [ -z "${POSTGRES_DB}" ] || [ -z "${POSTGRES_USER}" ]; then
  echo "✗ POSTGRES_DB/POSTGRES_USER no están en ${ENV_DESPLIEGUE}." >&2
  exit 1
fi

rm -rf "${PAQUETE}" "${ARCHIVO}"
mkdir -p "${PAQUETE}/config"

# ── 2. Base de datos ─────────────────────────────────────────────────────────
echo
echo "── 1/4 Base de datos ──"
if ! docker exec "${CONTENEDOR_DB}" pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; then
  anotar_fallo "${CONTENEDOR_DB} no responde: la base (órdenes, pagos, caja) NO se copió"
else
  # -Fc guarda en formato propio de PostgreSQL: permite restaurar tabla por
  # tabla y ya viene comprimido.
  if docker exec "${CONTENEDOR_DB}" pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -Fc > "${PAQUETE}/base.dump" 2>/dev/null && [ -s "${PAQUETE}/base.dump" ]; then
    chmod 600 "${PAQUETE}/base.dump"
    echo "  ✓ base.dump ($(du -h "${PAQUETE}/base.dump" | cut -f1))"
  else
    anotar_fallo "pg_dump devolvió un archivo vacío: la base NO quedó respaldada"
  fi
fi

# ── 3. Capturas de pago (RF-11) ──────────────────────────────────────────────
# Viven fuera de la base, en un volumen del disco de datos. Sin esta copia se
# perderían los vouchers con los que se concilian los cobros.
echo
echo "── 2/4 Capturas de pago ──"
if [ ! -d "${VOLUMEN_CAPTURAS}" ]; then
  anotar_fallo "no existe ${VOLUMEN_CAPTURAS}: las capturas de Yape/transferencia NO se copiaron"
else
  TOTAL_CAPTURAS="$(find "${VOLUMEN_CAPTURAS}" -type f | wc -l)"
  if [ "${TOTAL_CAPTURAS}" -eq 0 ]; then
    # No es un fallo: puede que todavía nadie haya adjuntado nada.
    echo "  · sin capturas adjuntas todavía (nada que copiar)"
    mkdir -p "${PAQUETE}/comprobantes"
  else
    # Se copia con un contenedor porque los archivos pertenecen al usuario de la
    # API (uid 100), no al usuario que ejecuta este script.
    docker run --rm -v "${VOLUMEN_CAPTURAS}:/origen:ro" -v "${PAQUETE}:/destino" alpine:3 \
      tar -czf /destino/comprobantes.tar.gz -C /origen . >/dev/null
    echo "  ✓ comprobantes.tar.gz (${TOTAL_CAPTURAS} archivos, $(du -h "${PAQUETE}/comprobantes.tar.gz" | cut -f1))"
  fi
fi

# ── 4. Configuración del despliegue ──────────────────────────────────────────
# Sin esto, restaurar obliga a reconstruir a mano cómo estaba montado el sistema.
echo
echo "── 3/4 Configuración ──"
cp "${DESPLIEGUE}/docker-compose.yml" "${PAQUETE}/config/" 2>/dev/null \
  && echo "  ✓ docker-compose.yml" \
  || anotar_fallo "no se pudo copiar docker-compose.yml"

if [ "${INCLUIR_CONFIG}" -eq 1 ]; then
  if cp "${DESPLIEGUE}/.env" "${PAQUETE}/config/.env" 2>/dev/null; then
    chmod 600 "${PAQUETE}/config/.env"
    echo "  ✓ .env (contiene claves: trátese como un secreto)"
  else
    anotar_fallo "no se pudo copiar el .env del despliegue"
  fi
else
  echo "  · .env omitido a propósito (--sin-config)"
fi

# Versión del sistema que se está respaldando: sin esto, un paquete de hace un
# mes no se sabe a qué código corresponde.
{
  echo "Fecha:            $(date -Is)"
  echo "Commit desplegado: $(git -C "${HOME}/data/repos/impresos-trujillo" rev-parse --short HEAD 2>/dev/null || echo 'desconocido')"
  echo "Rama:             $(git -C "${HOME}/data/repos/impresos-trujillo" rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'desconocida')"
  echo "PostgreSQL:       $(docker exec "${CONTENEDOR_DB}" postgres --version 2>/dev/null || echo 'desconocido')"
  echo "Órdenes:          $(docker exec "${CONTENEDOR_DB}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc 'SELECT count(*) FROM ordenes' 2>/dev/null || echo '-')"
  echo "Pagos:            $(docker exec "${CONTENEDOR_DB}" psql -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" -tAc 'SELECT count(*) FROM orden_pagos' 2>/dev/null || echo '-')"
  echo "Capturas:         $(find "${VOLUMEN_CAPTURAS}" -type f 2>/dev/null | wc -l)"
} > "${PAQUETE}/MANIFIESTO.txt"
echo "  ✓ MANIFIESTO.txt (para comprobar que la restauración trajo todo)"

# ── 5. Empaquetar y rotar ────────────────────────────────────────────────────
echo
echo "── 4/4 Cierre ──"
if [ "${EMPAQUETAR}" -eq 1 ]; then
  tar -czf "${ARCHIVO}" -C "${DESTINO}" "impresos-${FECHA}"
  chmod 600 "${ARCHIVO}"
  rm -rf "${PAQUETE}"
  echo "  ✓ ${ARCHIVO} ($(du -h "${ARCHIVO}" | cut -f1))"
else
  echo "  · paquete sin empaquetar en ${PAQUETE}"
fi

BORRADOS="$(find "${DESTINO}" -maxdepth 1 -name 'impresos-*' -mtime "+${RETENCION_DIAS}" -print -delete 2>/dev/null | wc -l)"
echo "  · rotación: ${BORRADOS} paquete(s) con más de ${RETENCION_DIAS} días"

if [ "${FALLOS}" -gt 0 ]; then
  echo
  echo "RESULTADO: INCOMPLETO — ${FALLOS} paso(s) fallaron. Revisa ${LOG}."
  exit 1
fi

echo
echo "RESULTADO: OK — paquete del ${FECHA} listo."
echo "AVISO: este paquete está en el mismo disco que el sistema que protege."
echo "       Para que sirva de verdad, hay que copiarlo fuera del servidor."
