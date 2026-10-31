#!/usr/bin/env bash
# Ejecutar en el VPS; mantiene artefactos fuera del contenedor y del repositorio.
set -euo pipefail

FUENTE="${HOME}/data/repos/impresos-trujillo"
DEPLOY="${HOME}/data/deploy/impresos"
COMMIT_ESPERADO="${1:-}"

if [[ -n "${COMMIT_ESPERADO}" && "$(git -C "${FUENTE}" rev-parse HEAD)" != "${COMMIT_ESPERADO}" ]]; then
  echo "Se omite IA: producción no corresponde al commit programado." >&2
  exit 0
fi

mkdir -p "${DEPLOY}/ia"
# La API se ejecuta como app (uid 100, gid 101). Nunca toca el volumen de PostgreSQL.
docker run --rm -v "${DEPLOY}/ia:/datos" alpine:3 chown 100:101 /datos
cd "${DEPLOY}"
docker compose run --rm --no-deps \
  -v "${DEPLOY}/ia:/var/lib/impresos/ia" \
  api python -m app.ia.reentrenamiento --destino /var/lib/impresos/ia
