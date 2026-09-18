"""Usuarios del sistema."""
from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TemporalMixin, enum_columna
from app.models.enums import Rol


class Usuario(Base, TemporalMixin):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    rol: Mapped[Rol] = mapped_column(
        enum_columna(Rol, "rol_usuario", 20), default=Rol.OPERARIO, nullable=False
    )
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # RNF-01: permite revocar todas las sesiones de un usuario incrementando
    # este contador; los JWT emitidos antes dejan de ser válidos.
    sesion_version: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    def __repr__(self) -> str:  # pragma: no cover - solo depuración
        return f"<Usuario {self.id} {self.email} ({self.rol})>"
