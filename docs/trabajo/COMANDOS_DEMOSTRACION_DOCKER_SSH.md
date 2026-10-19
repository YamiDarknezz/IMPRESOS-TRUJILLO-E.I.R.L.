# GUÍA RÁPIDA: COMANDOS EN VIVO DOCKER (SSH ORACLE)
### Para demostración ante el profesor — Copiar y Pegar

---

## 1. Conectarse al Servidor
Abre PowerShell o tu terminal de la laptop y escribe:
```bash
ssh oracle
```
*(Ya tienes la llave configurada, entrará directo como usuario `yami`)*

---

## 2. Mostrar los 3 Contenedores Activos y Saludables
Para que el profesor vea que todo el sistema está corriendo contenerizado:
```bash
docker ps --filter "name=impresos"
```
**Qué responder al profesor:**
> *"Aquí están los 3 servicios del sistema: impresos-api (FastAPI), impresos-web (Angular 21) e impresos-db (PostgreSQL), todos activos con healthcheck verificado."*

---

## 3. Mostrar Logs del Backend en Vivo (FastAPI)
Para mostrar el motor transaccional y peticiones REST:
```bash
docker logs --tail 30 -f impresos-api
```
*(Para salir del modo en vivo presiona `Ctrl + C`)*

**Qué responder al profesor:**
> *"Aquí se observan los logs en tiempo real de Uvicorn/FastAPI procesando las peticiones asíncronas con códigos de respuesta HTTP 200 OK."*

---

## 4. Truco de Demostración en Vivo (Generar Logs en Tiempo Real)
Con la terminal anterior abierta con `docker logs -f impresos-api`, abre otra pestaña de terminal o navegador:

**Opción A (Desde otra pestaña de la terminal):**
```bash
curl -s https://imprenta.darknezz.dev/health
```

**Opción B (Desde el navegador de tu laptop):**
Entra a:
`https://imprenta.darknezz.dev`

**Efecto:** La terminal donde tienes los logs imprimirá de inmediato una nueva línea:
`INFO: GET /health HTTP/1.1 200 OK`
demostrando que el software está 100% operativo y conectado en vivo.

---

## 5. Mostrar Logs de la Base de Datos (PostgreSQL)
Si el profesor pregunta si la base de datos realmente está en contenedor Docker:
```bash
docker logs --tail 25 impresos-db
```
**Qué responder al profesor:**
> *"El motor PostgreSQL 17 alpine está contenerizado con volumen persistente, garantizando integridad transaccional ACID."*

---

## 6. Mostrar Logs del Frontend (Angular 21)
```bash
docker logs --tail 25 impresos-web
```
**Qué responder al profesor:**
> *"El contenedor frontend entrega la aplicación Angular 21 compilada en producción con Nginx ligero."*

---

## 7. Mostrar Consumo de Memoria y CPU (Eficiencia)
Si el profesor pregunta por rendimiento o recursos:
```bash
docker stats --no-stream $(docker ps -q --filter "name=impresos")
```
**Qué responder al profesor:**
> *"La solución completa consume menos de 250 MB de memoria RAM combinada, lo que demuestra la alta eficiencia de la arquitectura contenerizada."*

---

## 8. Ver el archivo Docker Compose
Si pide ver la arquitectura declarativa de los contenedores:
```bash
cat /home/yami/data/deploy/impresos/docker-compose.yml
```

---

## RESUMEN DE 1 LÍNEA PARA TENER EN WHATSAPP:
```text
ssh oracle
docker ps --filter "name=impresos"
docker logs --tail 30 -f impresos-api
docker logs --tail 20 impresos-db
docker stats --no-stream $(docker ps -q --filter "name=impresos")
```
