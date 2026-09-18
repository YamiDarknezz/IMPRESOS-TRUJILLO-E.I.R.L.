"""Contexto de la petición actual.

El registro de auditoría necesita saber desde qué IP se hizo una operación,
pero los servicios no conocen HTTP ni FastAPI. Un `ContextVar` que llena un
middleware de `main.py` resuelve esa distancia sin ensuciar la firma de los
servicios.
"""
from contextvars import ContextVar

ip_cliente: ContextVar[str] = ContextVar("ip_cliente", default="")
