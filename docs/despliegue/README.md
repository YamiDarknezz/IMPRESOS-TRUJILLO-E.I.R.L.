# Despliegue continuo — CI/CD

Cómo funciona el pipeline de este repositorio y qué hay que hacer en el VPS.

## 1. El flujo, de punta a punta

```
push a una rama / Pull Request
        │
        ▼
GitHub Actions  (.github/workflows/ci.yml)
        │
        ├── job backend   →  PostgreSQL 17 real + migraciones + 96 pruebas
        ├── job frontend  →  pruebas + build de producción
        │
        └── job desplegar (SOLO en main, y solo si los dos pasaron)
                    │
                    ▼  SSH al VPS
              git pull --ff-only origin main
              docker compose run --rm api python -m alembic upgrade head
              docker compose up -d --build
              smoke test contra /health  ← si falla, el job falla
```

**El artefacto compilado nunca viaja al VPS.** El despliegue reconstruye en el
servidor desde el mismo commit que ya pasó las pruebas. Así lo que corre en
producción es exactamente lo que se validó, y no hay binarios cruzando por SSH.

## 2. Puesta en marcha (una sola vez)

### 2.1 Secretos en GitHub

En `Settings → Secrets and variables → Actions` del repositorio, crear tres:

| Secreto | Contenido |
|---|---|
| `VPS_HOST` | IP o dominio del VPS |
| `VPS_USER` | usuario SSH (`yami`) |
| `DEPLOY_KEY` | llave privada SSH dedicada al despliegue |

La `DEPLOY_KEY` **no es la llave personal**. Se genera una sola para esto y se
autoriza únicamente en el servidor:

```bash
# en el VPS
ssh-keygen -t ed25519 -f ~/.ssh/deploy/ci_deploy -N "" -C "ci-impresos"
cat ~/.ssh/deploy/ci_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/deploy/ci_deploy          # esto se pega en el secreto DEPLOY_KEY
```

### 2.2 Preparar el VPS

```bash
# 1) Código fuente (el CI hace `git pull` aquí)
cd $HOME/data/repos
git clone git@github.com:YamiDarknezz/IMPRESOS-TRUJILLO-E.I.R.L..git impresos-trujillo

# 2) Carpeta de despliegue (NO es repositorio git: aquí vive el .env)
mkdir -p $HOME/data/deploy/impresos
mkdir -p $HOME/data/volumes/impresos/postgres

# 3) Copiar el compose y el generador de secretos desde las plantillas del repo
cp $HOME/data/repos/impresos-trujillo/docs/despliegue/vps/docker-compose.yml \
   $HOME/data/deploy/impresos/docker-compose.yml
cp $HOME/data/repos/impresos-trujillo/docs/despliegue/vps/generar-env.sh \
   $HOME/data/deploy/impresos/generar-env.sh

# 4) Crear el .env con secretos aleatorios (permisos 600)
cd $HOME/data/deploy/impresos
bash generar-env.sh
```

> La carpeta `~/data/deploy/` **no está en git** — por eso los secretos pueden
> vivir ahí. El `.env` real nunca entra al repositorio.

### 2.3 Primer despliegue

```bash
cd $HOME/data/deploy/impresos
docker compose up -d --build
docker compose ps          # los tres servicios deben estar Up (healthy)
```

## 3. Cómo se despliega después

Automático: al mergear a `main`, el job `desplegar` lo hace solo.

Manual (por ejemplo para probar un arreglo del compose):

```bash
cd $HOME/data/deploy/impresos
docker compose run --rm api python -m alembic upgrade head
docker compose up -d --build
```

## 4. Verificación

```bash
# Estado de los contenedores (los tres deben decir Up y no Restarting)
cd $HOME/data/deploy/impresos && docker compose ps

# La app responde por HTTPS (200 esperado)
curl -sk -o /dev/null -w '%{http_code}\n' https://imprenta.darknezz.dev/

# La API responde a través del proxy de nginx (200 esperado)
curl -sk -o /dev/null -w '%{http_code}\n' https://imprenta.darknezz.dev/health

# Un login con credenciales malas debe dar 401 y NO un error 500
curl -sk -o /dev/null -w '%{http_code}\n' -X POST \
  -H 'Content-Type: application/json' \
  -d '{"email":"no@existe.pe","password":"malo"}' \
  https://imprenta.darknezz.dev/api/auth/login

# Migraciones aplicadas en la base real
docker compose exec db psql -U impresos -d impresos -c 'SELECT version_num FROM alembic_version;'
```

## 5. Si algo sale mal

**Revertir el despliegue:** el código se despliega por commit, así que se vuelve
al commit anterior y se reconstruye:

```bash
cd $HOME/data/repos/impresos-trujillo
git log --oneline -5                 # identificar el commit bueno
git checkout <sha-bueno>
cd $HOME/data/deploy/impresos && docker compose up -d --build
# y después: git checkout main  (para que el próximo deploy vuelva a la rama)
```

**Una migración rota:** `docker compose run --rm api python -m alembic downgrade -1`
antes de reconstruir. Las migraciones tienen `upgrade` y `downgrade` escritos.

**El sitio da 502:** nginx no encuentra el contenedor de la API. Revisar
`docker compose logs api` y `docker compose ps`. La configuración de nginx usa
el DNS interno de Docker, así que se recupera sola cuando la API vuelve.

## 6. Errores que ya están resueltos y por qué

Estos ya están contemplados; se dejan escritos para que nadie los "arregle" de vuelta:

| Situación | Por qué está así |
|---|---|
| `npm run test -- --watch=false` en el CI | Sin `--watch=false` el runner se queda esperando cambios y el job nunca termina |
| La API no publica puertos y no está en la red `proxy` | Solo nginx es alcanzable desde internet. Menos superficie expuesta |
| **No** se pone filtro de rutas (`paths:`) en el workflow | Si un job filtrado por ruta es un check obligatorio, los PRs que no tocan esa ruta quedan bloqueados para siempre |
| `proxy_pass` con variable + `resolver` en nginx | Con el nombre fijo, nginx resuelve una sola vez al arrancar y al recrear la API queda con una IP muerta |
| `set -e` en el script del job de despliegue | Sin él, un fallo de `git` o de compose deja el job en verde con el código viejo en producción |
| La contraseña de la base es alfanumérica | Un símbolo tipo `@` o `:` rompe la URL de conexión y el error se ve como fallo de autenticación |
| Las cabeceras de seguridad están en `nginx.conf`, no en `public/_headers` | `_headers` es una convención de **Netlify / Cloudflare Pages**: nginx no la lee. Estando ahí, la aplicación se servía sin CSP, sin `X-Frame-Options` y sin `nosniff` |
| La extensión `unaccent` / `pg_trgm` | Las declara `db/init/`, pero el código usa `ILIKE` simple: **ninguna consulta las usa hoy**. Ver "Pendientes" |

## 7. Pendientes y recomendaciones

1. **`JWT_SECRET` obligatorio en producción.** El valor por defecto está escrito
   en el código y el repositorio es público: con él cualquiera puede firmar
   tokens válidos. `generar-env.sh` ya crea uno aleatorio; solo hay que no
   saltarse ese paso.
2. **Búsquedas con tildes.** El código usa `ILIKE` (insensible a mayúsculas, pero
   sensible a tildes): buscar "carton" no encuentra "Cartón". Las extensiones
   `unaccent` y `pg_trgm` están declaradas pero sin usar. Si se quiere búsqueda
   con tildes, hay que cambiar las consultas para usar `unaccent(...)`.
3. **Sin linter.** No hay `ruff`/`mypy` configurados. Agregarlo después de poner
   el CI en verde, en un PR aparte:
   `pip install ruff && ruff check . --fix && ruff format .`
4. **Respaldo de la base.** El respaldo semanal del VPS cubre `~/data/deploy/`
   (incluido el `.env`), pero la base se respalda con
   `docker compose exec db pg_dump -U impresos -d impresos -Fc > impresos.dump`.
   Conviene agregarlo al respaldo.
5. **El README dice "Despliegue: Docker + Cloud Run"** y el backend dice Python
   3.11, cuando la imagen y el CI usan 3.13. Vale la pena alinearlo.
