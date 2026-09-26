#!/usr/bin/env bash
# Genera el .env de producción con secretos aleatorios.
#
#   cd $HOME/data/deploy/impresos
#   bash generar-env.sh
#
# Es idempotente: si ya existe un .env, NO lo pisa (lo respalda y avisa), para
# no romper una instalación que ya está funcionando.
set -euo pipefail

DESTINO="$(cd "$(dirname "$0")" && pwd)/.env"

if [ -f "$DESTINO" ]; then
  RESPALDO="${DESTINO}.bak-$(date +%Y%m%d-%H%M%S)"
  cp -p "$DESTINO" "$RESPALDO"
  chmod 600 "$RESPALDO"
  echo "Ya existía un .env. Se respaldó en: $RESPALDO"
  echo "No se sobrescribió nada. Borra el .env y vuelve a correr si quieres regenerarlo."
  exit 0
fi

# Contraseña alfanumérica a propósito: si lleva símbolos, la URL
# postgresql+asyncpg://usuario:clave@db:5432/base se rompe al parsear el `@`
# o los dos puntos, y el error aparece como "fallo de autenticación".
CLAVE_DB="$(python3 -c "import secrets,string; print(''.join(secrets.choice(string.ascii_letters+string.digits) for _ in range(40)))")"
JWT_SECRETO="$(python3 -c "import secrets; print(secrets.token_urlsafe(48))")"

cat > "$DESTINO" <<EOF
POSTGRES_DB=impresos
POSTGRES_USER=impresos
POSTGRES_PASSWORD=${CLAVE_DB}
IMPRESOS_DOMAIN=imprenta.darknezz.dev
JWT_SECRET=${JWT_SECRETO}
ALLOWED_ORIGINS=https://imprenta.darknezz.dev
ADELANTO_MINIMO_PORCENTAJE=50
IGV_PORCENTAJE=18
PERU_UTC_OFFSET_HORAS=-5
JWT_EXPIRACION_MINUTOS=720
EOF

chmod 600 "$DESTINO"
echo "Creado: $DESTINO (permisos 600)"
echo
echo "Contraseña de la base (guárdala en tu gestor):"
grep '^POSTGRES_PASSWORD=' "$DESTINO" | cut -d= -f2
