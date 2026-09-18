"""Endpoints de usuarios del sistema (solo administradores)."""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.database import obtener_sesion
from app.core.errores import Conflicto, NoEncontrado
from app.core.security import hash_password, solo_admin, supervision, usuario_actual
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
