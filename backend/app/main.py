"""Punto de entrada de la API.

Arquitectura en capas:

    routers/    HTTP: rutas, permisos y forma de la respuesta
    services/   reglas del negocio (no conocen HTTP ni FastAPI)
    schemas/    validación de la entrada (Pydantic)
    models/     ORM de SQLAlchemy (PostgreSQL)
    core/       infraestructura: config, base de datos, auth, errores, fechas

Los manejadores de excepciones de abajo son lo que permite que los routers no
repitan try/except: un error de negocio sale con su código y su mensaje, y
cualquier fallo inesperado se registra completo en el log pero al cliente solo
le llega un mensaje genérico.
"""
import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings, validar_jwt_secret
from app.core.contexto import ip_cliente
from app.core.errores import MENSAJE_ERROR_INTERNO, ErrorDeNegocio, logger
from app.routers import (
    auditoria,
    auth,
    caja,
    clientes,
    finanzas,
    inventario,
    ordenes,
    productos,
    unidades,
    usuarios,
)

logging.basicConfig(level=settings.log_level)
validar_jwt_secret(settings.entorno, settings.jwt_secret)

app = FastAPI(
    title=settings.app_nombre,
    description="Sistema de gestión de órdenes, inventario y caja para Impresos Trujillo",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Middleware ──────────────────────────────────────────────────────────────

@app.middleware("http")
async def registrar_ip(request: Request, call_next):
    """
    Deja la IP del cliente disponible para el registro de auditoría.

    `X-Forwarded-For` no sirve como fuente: nginx lo AMPLÍA en vez de
    reemplazarlo (`$proxy_add_x_forwarded_for`), así que el primer valor
    sigue siendo el que decide mandar el cliente. `X-Real-IP` en cambio lo
    fija nginx con `$remote_addr` (`frontend/nginx.conf`), su propio socket,
    y lo sobreescribe sin importar qué mande el cliente.
    """
    ip_real = request.headers.get("x-real-ip", "").strip()
    ip_cliente.set(ip_real or (request.client.host if request.client else ""))
    return await call_next(request)


# ── Manejo centralizado de errores ──────────────────────────────────────────

@app.exception_handler(ErrorDeNegocio)
async def manejar_error_de_negocio(request: Request, exc: ErrorDeNegocio):
    """
    El usuario pidió algo que las reglas no permiten: su mensaje sí se le
    muestra, porque le dice exactamente qué corregir.
    """
    return JSONResponse(status_code=exc.estado_http, content={"detail": str(exc)})


@app.exception_handler(RequestValidationError)
async def manejar_error_de_validacion(request: Request, exc: RequestValidationError):
    """
    FastAPI manda el `detail` de un 422 como una LISTA de errores; el cliente
    (`mensajeDeError`, en el frontend) espera un texto. Sin este handler,
    ninguna validación de esquema (Pydantic) le llega al usuario: solo ve
    "Error al guardar...", el mensaje de respaldo genérico.
    """
    mensajes = []
    for error in exc.errors():
        campo = ".".join(str(parte) for parte in error["loc"] if parte != "body")
        mensajes.append(f"{campo}: {error['msg']}" if campo else error["msg"])
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={"detail": " | ".join(mensajes)},
    )


@app.exception_handler(Exception)
async def manejar_error_inesperado(request: Request, exc: Exception):
    """
    Cualquier otro fallo: se registra completo en el servidor y al cliente solo
    le llega un mensaje genérico, para no filtrar rutas ni detalles internos.
    """
    logger.exception("Error interno no controlado en %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": MENSAJE_ERROR_INTERNO})


# ── Rutas ───────────────────────────────────────────────────────────────────

for modulo in (auth, usuarios, clientes, unidades, inventario, productos, ordenes, finanzas, caja, auditoria):
    app.include_router(modulo.router)


@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok"}
