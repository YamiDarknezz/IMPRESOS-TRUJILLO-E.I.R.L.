"""Punto de entrada de la API - Arquitectura modular FastAPI."""
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.contexto import ip_cliente
from app.core.errores import MENSAJE_ERROR_INTERNO, ErrorDeNegocio, logger
from app.routers import auth, usuarios

logging.basicConfig(level=settings.log_level)

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
    """Deja la IP del cliente disponible para el registro de auditoría."""
    reenviada = request.headers.get("x-forwarded-for", "")
    ip_cliente.set((reenviada.split(",")[0].strip() if reenviada else None) or (request.client.host if request.client else ""))
    return await call_next(request)


# ── Manejo centralizado de errores ──────────────────────────────────────────

@app.exception_handler(ErrorDeNegocio)
async def manejar_error_de_negocio(request: Request, exc: ErrorDeNegocio):
    return JSONResponse(status_code=exc.estado_http, content={"detail": str(exc)})


@app.exception_handler(Exception)
async def manejar_error_inesperado(request: Request, exc: Exception):
    logger.exception("Error interno no controlado en %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": MENSAJE_ERROR_INTERNO})


# ── Rutas ───────────────────────────────────────────────────────────────────

for modulo in (auth, usuarios):
    app.include_router(modulo.router)


@app.get("/health", tags=["Sistema"])
def health():
    return {"status": "ok"}
