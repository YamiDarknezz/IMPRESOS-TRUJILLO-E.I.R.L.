"""Normalización y búsqueda de contactos sin alterar registros históricos."""
import re

from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Cliente


def normalizar_contacto(valor: str | None) -> str:
    texto = (valor or "").strip()
    if re.fullmatch(r"@[A-Za-z0-9_.]+", texto):
        return texto.lower()
    if not re.fullmatch(r"[+\d\s().-]+", texto):
        return texto
    digitos = re.sub(r"\D", "", texto)
    if len(digitos) == 11 and digitos.startswith("51") and digitos[2] == "9":
        return "+" + digitos
    if len(digitos) == 9 and digitos.startswith("9"):
        return "+51" + digitos
    return texto


def telefono_en_nombre(nombre: str) -> str | None:
    normalizado = normalizar_contacto(nombre)
    return normalizado if re.fullmatch(r"\+519\d{8}", normalizado) else None


async def coincidencias_contacto(sesion: AsyncSession, contacto: str) -> list[Cliente]:
    clave = normalizar_contacto(contacto)
    if not clave or not (re.fullmatch(r"\+519\d{8}", clave) or clave.startswith("@")):
        return []
    # La validación y la escritura comparten transacción: dos altas simultáneas
    # del mismo contacto esperan entre sí antes de buscar y crear.
    if sesion.get_bind().dialect.name == "postgresql":
        await sesion.execute(text("SELECT pg_advisory_xact_lock(hashtext(:clave))"), {"clave": "cliente-contacto:" + clave})
    clientes = (await sesion.execute(select(Cliente))).scalars()
    return [c for c in clientes if normalizar_contacto(c.telefono) == clave or telefono_en_nombre(c.nombre) == clave]
