"""Esquemas de clientes."""
from pydantic import BaseModel, field_validator

from app.models import TipoCliente
from app.schemas.comunes import exigir_texto, limpiar


class ClienteCreateData(BaseModel):
    """
    Solo el nombre es obligatorio: muchos trabajos son rápidos e informales
    y no siempre se piden los datos de contacto.
    """

    nombre: str
    tipo: TipoCliente = TipoCliente.PERSONA
    documento: str = ""
    telefono: str = ""
    email: str = ""
    direccion: str = ""
    notas: str = ""
    es_corporativo: bool = False

    @field_validator("nombre")
    @classmethod
    def _nombre_obligatorio(cls, v: str) -> str:
        return exigir_texto(v, "El nombre es requerido")

    @field_validator("documento", "telefono", "email", "direccion", "notas")
    @classmethod
    def _limpiar(cls, v: str) -> str:
        return limpiar(v)


class ClienteUpdateData(ClienteCreateData):
    """Mismos campos que la creación; el id va en la URL."""
