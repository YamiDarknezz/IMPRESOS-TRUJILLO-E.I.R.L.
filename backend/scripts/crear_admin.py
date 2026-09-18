"""Crea o restablece el usuario administrador inicial.

Uso (desde la carpeta backend, con la base ya migrada):

    python scripts/crear_admin.py --email admin@impresostrujillo.pe \
        --password "ClaveSegura123" --nombre "Angel Rodríguez"

Si el correo ya existe, actualiza nombre, contraseña, rol y lo reactiva.
"""
import argparse
import asyncio
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from sqlalchemy import func, select  # noqa: E402

from app.core.database import FabricaSesiones  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models import Rol, Usuario  # noqa: E402


async def crear_admin(nombre: str, email: str, password: str) -> None:
    async with FabricaSesiones() as sesion:
        usuario = (
            await sesion.execute(select(Usuario).where(func.lower(Usuario.email) == email.lower()))
        ).scalar_one_or_none()

        if usuario is None:
            sesion.add(
                Usuario(
                    nombre=nombre,
                    email=email.lower(),
                    password_hash=hash_password(password),
                    rol=Rol.ADMIN,
                )
            )
            print(f"Administrador creado: {email}")
        else:
            usuario.nombre = nombre
            usuario.password_hash = hash_password(password)
            usuario.rol = Rol.ADMIN
            usuario.activo = True
            print(f"Administrador actualizado: {email}")

        await sesion.commit()


def main() -> None:
    parser = argparse.ArgumentParser(description="Crea el administrador inicial del sistema.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--nombre", default="Administrador")
    args = parser.parse_args()
    asyncio.run(crear_admin(args.nombre, args.email, args.password))


if __name__ == "__main__":
    main()
