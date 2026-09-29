"""Esquemas de clientes."""
from pydantic import BaseModel, Field, field_validator, model_validator

from app.models import TipoCliente
from app.schemas.comunes import exigir_texto, limpiar

# DNI (persona) y RUC (empresa): cantidad de dígitos que exige SUNAT/RENIEC.
_LONGITUD_DOCUMENTO = {TipoCliente.PERSONA: 8, TipoCliente.EMPRESA: 11}


class ClienteCreateData(BaseModel):
    """
    Solo el nombre es obligatorio: muchos trabajos son rápidos e informales
    y no siempre se piden los datos de contacto.
    """

    nombre: str = Field(max_length=150)
    tipo: TipoCliente = TipoCliente.PERSONA
    documento: str = Field(default="", max_length=20)
    telefono: str = Field(default="", max_length=30)
    email: str = Field(default="", max_length=150)
    direccion: str = Field(default="", max_length=200)
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

    @model_validator(mode="after")
    def _documento_valido(self) -> "ClienteCreateData":
        """Si se da un documento, debe ser solo dígitos y del largo que exige el tipo."""
        if not self.documento:
            return self
        if not self.documento.isdigit():
            raise ValueError("El documento solo debe contener números.")
        esperado = _LONGITUD_DOCUMENTO[self.tipo]
        if len(self.documento) != esperado:
            etiqueta = "DNI" if self.tipo == TipoCliente.PERSONA else "RUC"
            raise ValueError(f"El {etiqueta} debe tener {esperado} dígitos.")
        return self


class ClienteUpdateData(ClienteCreateData):
    """Mismos campos que la creación; el id va en la URL."""
