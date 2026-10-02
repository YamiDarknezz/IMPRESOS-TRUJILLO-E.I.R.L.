"""Endpoints de usuarios del sistema (solo administradores)."""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.database import obtener_sesion
from app.core.errores import Conflicto, ErrorDeNegocio, NoEncontrado
from app.core.security import (
    generar_password_temporal,
    hash_password,
    solo_admin,
    supervision,
    usuario_actual,
)
from app.models import TipoEventoAuditoria, Usuario
from app.schemas import UsuarioCreateData, UsuarioUpdateData
from app.services.serializadores import serializar_usuario

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])


@router.get("/me")
async def mi_perfil(usuario: Annotated[Usuario, Depends(usuario_actual)]):
    """Perfil del usuario autenticado (lo consulta la interfaz al entrar)."""
    return {"status": "success", "data": serializar_usuario(usuario)}


@router.get("")
async def listar_usuarios(
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Lista de cuentas: la necesita la supervisión para asignar órdenes."""
    usuarios = (
        await sesion.execute(select(Usuario).order_by(func.lower(Usuario.nombre)))
    ).scalars()
    return {"status": "success", "data": [serializar_usuario(u) for u in usuarios]}


@router.post("")
async def crear_usuario(
    data: UsuarioCreateData,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    existente = (
        await sesion.execute(select(Usuario).where(func.lower(Usuario.email) == data.email.lower()))
    ).scalar_one_or_none()
    if existente is not None:
        raise Conflicto("Ya existe un usuario con ese correo.")

    usuario = Usuario(
        nombre=data.nombre,
        email=data.email.lower(),
        password_hash=hash_password(data.password),
        rol=data.rol,
        # La contraseña la eligió el administrador, no el dueño de la cuenta:
        # se fuerza a cambiarla en el primer ingreso (issue #51).
        debe_cambiar_password=True,
    )
    sesion.add(usuario)
    await sesion.flush()

    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="usuarios",
        registro_id=usuario.id,
        detalle=f"Usuario {usuario.email} ({usuario.rol.value})",
        valores_nuevos={"email": usuario.email, "rol": usuario.rol.value},
    )
    return {"status": "success", "data": serializar_usuario(usuario)}


@router.patch("/{usuario_id}")
async def actualizar_usuario(
    usuario_id: int,
    data: UsuarioUpdateData,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    usuario = await sesion.get(Usuario, usuario_id)
    if usuario is None:
        raise NoEncontrado("Usuario no encontrado.")

    if usuario_id == admin.id:
        # Desactivarse revoca la sesión propia de inmediato: si era el único
        # admin, nadie queda con acceso a /usuarios y la única recuperación
        # es por SSH. Que lo haga otro administrador.
        if data.rol is not None and data.rol != usuario.rol:
            raise ErrorDeNegocio("No puedes cambiar tu propio rol. Pídeselo a otro administrador.")
        if data.activo is not None and not data.activo:
            raise ErrorDeNegocio("No puedes desactivar tu propia cuenta. Pídeselo a otro administrador.")

    anteriores = {"nombre": usuario.nombre, "rol": usuario.rol.value, "activo": usuario.activo}

    if data.nombre is not None:
        usuario.nombre = data.nombre
    if data.rol is not None and data.rol != usuario.rol:
        usuario.rol = data.rol
    if data.activo is not None and data.activo != usuario.activo:
        usuario.activo = data.activo
        # Al desactivar se revocan sus sesiones de inmediato.
        if not data.activo:
            usuario.sesion_version += 1

    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.EDITAR,
        tabla_afectada="usuarios",
        registro_id=usuario.id,
        detalle=f"Usuario {usuario.email} actualizado",
        valores_anteriores=anteriores,
        valores_nuevos={
            "nombre": usuario.nombre,
            "rol": usuario.rol.value,
            "activo": usuario.activo,
        },
    )
    return {"status": "success", "data": serializar_usuario(usuario)}


@router.post("/{usuario_id}/password")
async def restablecer_password(
    usuario_id: int,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """
    Genera una contraseña temporal para una cuenta que la olvidó (issue #51).

    Antes de esto, la única salida era recrear la cuenta (cambia el `id` y
    rompe el historial de `ordenes.asignado_a`) o intervenir en la base.
    Se fuerza el cambio en el siguiente ingreso y se revocan las sesiones
    vigentes; la temporal solo se devuelve esta vez, no queda en ningún lado.
    """
    usuario = await sesion.get(Usuario, usuario_id)
    if usuario is None:
        raise NoEncontrado("Usuario no encontrado.")

    temporal = generar_password_temporal()
    usuario.password_hash = hash_password(temporal)
    usuario.debe_cambiar_password = True
    usuario.sesion_version += 1

    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.EDITAR,
        tabla_afectada="usuarios",
        registro_id=usuario.id,
        detalle=f"Contraseña de {usuario.email} restablecida por un administrador",
    )
    return {"status": "success", "data": {"password_temporal": temporal}}
