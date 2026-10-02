# Copias de seguridad

Todo lo que hace falta para volver a levantar el sistema después de perder el
servidor: **la base de datos, las capturas de pago y la configuración del
despliegue**.

Esta carpeta no contiene datos: contiene el procedimiento y los dos scripts que
lo ejecutan.

| Archivo | Para qué |
|---|---|
| `backup.sh` | Genera el paquete del día |
| `restore.sh` | Restaura un paquete, o lo compara con el sistema en marcha sin tocar nada |
| `README.md` | Este documento: cómo se procesa la copia |

---

## 1. Qué se respalda y qué no

**Sí:**

- **Base de datos** (`base.dump`): órdenes, ítems, materiales, pagos, clientes,
  inventario, usuarios, caja y auditoría. Se guarda con `pg_dump -Fc`, el formato
  propio de PostgreSQL: viene comprimido y permite restaurar tabla por tabla.
- **Capturas de pago** (`comprobantes.tar.gz`): los vouchers de Yape y
  transferencia que se adjuntan a las órdenes. **No viven en la base**, viven en
  un volumen del disco de datos; si esta copia faltara, se perdería la evidencia
  con la que se concilian los cobros.
- **Configuración** (`config/`): el `docker-compose.yml` y el `.env` del
  despliegue, más un `MANIFIESTO.txt` con el commit desplegado, las versiones y
  los conteos del momento.

**No:**

- **El código**: vive en Git, se recupera con un `git clone`.
- **Las imágenes de Docker**: se reconstruyen desde el repositorio.
- **Los logs**: son para diagnosticar, no para recuperar.

El paquete es un único archivo por día: `impresos-AAAA-MM-DD.tar.gz`.

> **El paquete contiene secretos.** El `.env` incluye la contraseña de la base y
> la clave para firmar los tokens de sesión. Por eso se guarda con permisos
> `600` y, si alguna vez se copia fuera del servidor, debe ir cifrado. Con
> `--sin-config` se genera un paquete sin esa parte.

---

## 2. Cómo se ejecuta

### A mano

```bash
cd ~/data/repos/impresos-trujillo     # o donde esté este repositorio
./backups/backup.sh
```

Al terminar dice `RESULTADO: OK` o `RESULTADO: INCOMPLETO` con lo que falló. Deja
el detalle completo en `~/data/backups/impresos/backup.log`.

### Todos los días (recomendado)

```cron
# Copia de seguridad de Impresos Trujillo, todos los días a las 3:00
0 3 * * * cd $HOME/data/repos/impresos-trujillo && ./backups/backup.sh >/dev/null 2>&1
```

Esas líneas todavía **no están instaladas**: hay que añadirlas al `crontab` del
servidor para que la copia se haga sola.

Ojo con no confundirlo con el respaldo del resto del servidor
(`darknezz-infra/scripts/backup.sh`), que corre **los domingos** y cubre Traefik,
Hermes y también la base de este proyecto. Este de aquí es el que se lleva
**las capturas y la configuración del despliegue**, así que conviene que corra a
diario: entre un domingo y el siguiente pueden entrar decenas de vouchers.

### Opciones

| Opción | Efecto |
|---|---|
| `--destino DIR` | Dónde dejar los paquetes (por defecto `~/data/backups/impresos`) |
| `--retencion DIAS` | Cuántos días se conservan (por defecto 30) |
| `--sin-config` | No incluir el `.env` (paquete sin secretos) |
| `--sin-empaquetar` | Dejar la carpeta en vez del `.tar.gz`, para inspeccionarla |

---

## 3. Cómo se procesa

1. **Lee las credenciales** del `.env` del despliegue. Si no puede, se detiene:
   sin credenciales no hay copia válida. Solo usa las dos variables de la base,
   el resto del archivo no sale de ahí.
2. **Comprueba que la base responde** (`pg_isready`) y hace el `pg_dump`.
3. **Empaqueta las capturas** con un contenedor, porque los archivos pertenecen
   al usuario de la API (`uid 100`) y no al usuario que ejecuta el script.
4. **Copia la configuración** y escribe el `MANIFIESTO.txt` con el commit
   desplegado y los conteos de órdenes, pagos y capturas del momento.
5. **Empaqueta y rota**: borra los paquetes con más de `--retencion` días.

**La regla que gobierna el script**: un paso crítico nunca se convierte en un
aviso silencioso. Si la base o las capturas no se pudieron copiar, el resultado
es `INCOMPLETO` y el script devuelve error. Un paquete que dice "OK" pero está
incompleto es peor que un error, porque se descubre el día en que hay que
restaurar.

---

## 4. Cómo se restaura

Primero, **mirar sin tocar**:

```bash
./backups/restore.sh ~/data/backups/impresos/impresos-2026-10-02.tar.gz --solo-verificar
```

Compara el contenido del paquete con lo que hay en marcha (órdenes, capturas) y
comprueba que el dump es legible. No modifica nada.

Para restaurar de verdad:

```bash
./backups/restore.sh ~/data/backups/impresos/impresos-2026-10-02.tar.gz
```

Pide escribir `SI` porque **reemplaza los datos actuales**: vuelve a crear el
esquema y carga los datos del paquete. Después rearma las capturas en el volumen
con el dueño correcto y compara los conteos con el manifiesto. Al final reinicia
la aplicación para que suelte el estado viejo:

```bash
cd ~/data/deploy/impresos && docker compose restart api web
```

Casos sueltos: `--solo-base` y `--solo-capturas` restauran una parte, y `--si`
evita la confirmación para un guion automatizado.

### Restaurar en otro servidor (desastre total)

```bash
git clone https://github.com/YamiDarknezz/IMPRESOS-TRUJILLO-E.I.R.L..git
cd IMPRESOS-TRUJILLO-E.I.R.L.
cp <paquete>/config/docker-compose.yml ~/data/deploy/impresos/
cp <paquete>/config/.env ~/data/deploy/impresos/          # 600
mkdir -p ~/data/volumes/impresos/comprobantes
cd ~/data/deploy/impresos && docker compose up -d db
./backups/restore.sh <paquete>                             # base + capturas
cd ~/data/deploy/impresos && docker compose up -d
```

---

## 5. Cómo se comprueba que la copia sirve

Un respaldo que nunca se ha restaurado no es un respaldo, es una suposición. Una
vez al mes:

1. `restore.sh <paquete> --solo-verificar` sobre el sistema en marcha.
2. Restaurar el paquete **en un servidor o base de pruebas**, no en producción,
   y abrir la aplicación para ver que las órdenes y sus capturas aparecen.
3. Anotar la fecha de la última prueba junto al paquete.

La restauración de este proyecto ya se hizo una vez de punta a punta en un
entorno de pruebas: 16 tablas y los mismos conteos antes y después, y las
capturas de vuelta en el volumen con su dueño correcto.

---

## 6. Lo que todavía no está cubierto

**La copia no sale del servidor.** Los paquetes quedan en
`~/data/backups/impresos`, en el mismo disco de 150 GB del sistema que protegen:
sirve si alguien borra datos por error o si un despliegue sale mal, pero no si
se pierde el disco o el servidor entero.

El siguiente paso es enviar el paquete a un almacenamiento externo (Cloudflare R2
o Backblaze B2, que tienen tramo gratuito de sobra para este volumen) y cifrarlo
antes de que salga. El script ya deja el paquete en un único archivo, que es lo
que ese envío necesita.
