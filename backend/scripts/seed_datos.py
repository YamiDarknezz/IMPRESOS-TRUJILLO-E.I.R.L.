"""Siembra el catálogo base y datos de demostración.

Uso (desde la carpeta backend, con la base migrada):

    python scripts/seed_datos.py

Es idempotente: si un registro ya existe (por nombre o correo), no lo duplica.
Los datos demo sirven para probar el sistema y para la demostración del T1; se
marcan con el prefijo "[Demo]" en las descripciones de órdenes para poder
identificarlos.

Los nombres del personal son genéricos a propósito: la Gerencia pidió
identificar al personal solo por su función operativa.
"""
import asyncio
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[1]))

from sqlalchemy import func, select  # noqa: E402

from app.core.database import FabricaSesiones  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.models import (  # noqa: E402
    Cliente,
    EstadoOrden,
    Material,
    MetodoPago,
    Orden,
    Producto,
    ProductoMaterial,
    Rol,
    TipoProducto,
    Unidad,
    UnidadNegocio,
    Usuario,
)
from app.schemas.orden import MaterialEstimado, OrdenCreateData  # noqa: E402
from app.services import ordenes_service  # noqa: E402

CLAVE_DEMO = "Demo12345"
PREFIJO_DEMO = "[Demo]"

UNIDADES = [
    ("metros cuadrados", "m2"),
    ("metro lineal", "ml"),
    ("unidad", "und"),
    ("kilogramo", "kg"),
    ("litro", "L"),
]

# Personal por función operativa (identidad anonimizada según acuerdo con la empresa).
USUARIOS = [
    ("Subgerencia Operativa", "subgerente@impresostrujillo.pe", Rol.SUBGERENTE),
    ("Secretaría de Taller", "secretaria@impresostrujillo.pe", Rol.SECRETARIA),
    ("Diseño Gráfico", "diseno@impresostrujillo.pe", Rol.DISENADORA),
    ("Operario de Taller 1", "operario1@impresostrujillo.pe", Rol.OPERARIO),
    ("Operario de Taller 2", "operario2@impresostrujillo.pe", Rol.OPERARIO),
]

# (nombre, unidad, stock inicial, alerta mínima, días de reabastecimiento)
MATERIALES = [
    ("Lona banner 13 oz", "m2", 120, 30, 5),
    ("Vinilo adhesivo", "m2", 80, 20, 5),
    ("Acrílico 3 mm", "m2", 25, 10, 7),
    ("Pegamento para gran formato", "kg", 40, 10, 4),
    ("Tinta ecosolvente", "L", 60, 15, 6),
    ("Ojalillos metálicos", "und", 500, 100, 10),
]

# (nombre, tipo, precio base, receta {material: cantidad por unidad})
PRODUCTOS = [
    (
        "Gigantografía en lona (por m2)",
        TipoProducto.PROPIO,
        28.0,
        {"Lona banner 13 oz": 1, "Tinta ecosolvente": 0.05},
    ),
    (
        "Banner publicitario 2x1 m",
        TipoProducto.PROPIO,
        65.0,
        {"Lona banner 13 oz": 2, "Ojalillos metálicos": 8},
    ),
    ("Diseño de arte publicitario", TipoProducto.SERVICIO, 40.0, {}),
    ("Tazas personalizadas", TipoProducto.SUBCONTRATADO, 25.0, {}),
    ("Trofeos grabados", TipoProducto.SUBCONTRATADO, 85.0, {}),
]

CLIENTES = [
    ("Cliente Persona Demo", False, "Cliente de mostrador para pruebas", "999111222"),
    ("Empresa Demo S.A.C.", False, "Cliente empresarial de pruebas", "044222333"),
    ("Cámara de Comercio Demo", True, "Orden corporativa con orden de compra formal", "044333444"),
]


async def _obtener_unidades(sesion) -> dict[str, Unidad]:
    for nombre, abreviatura in UNIDADES:
        existente = (
            await sesion.execute(select(Unidad).where(func.lower(Unidad.nombre) == nombre))
        ).scalar_one_or_none()
        if existente is None:
            sesion.add(Unidad(nombre=nombre, abreviatura=abreviatura))
    await sesion.flush()
    unidades = (await sesion.execute(select(Unidad))).scalars()
    return {unidad.abreviatura: unidad for unidad in unidades}


async def _obtener_usuarios(sesion) -> dict[str, Usuario]:
    for nombre, email, rol in USUARIOS:
        existente = (
            await sesion.execute(select(Usuario).where(Usuario.email == email))
        ).scalar_one_or_none()
        if existente is None:
            sesion.add(
                Usuario(
                    nombre=nombre,
                    email=email,
                    password_hash=hash_password(CLAVE_DEMO),
                    rol=rol,
                )
            )
    await sesion.flush()
    usuarios = (await sesion.execute(select(Usuario))).scalars()
    return {usuario.nombre: usuario for usuario in usuarios}


async def _obtener_materiales(sesion, unidades: dict[str, Unidad]) -> dict[str, Material]:
    for nombre, unidad, stock, alerta, dias in MATERIALES:
        existente = (
            await sesion.execute(select(Material).where(func.lower(Material.nombre) == nombre.lower()))
        ).scalar_one_or_none()
        if existente is None:
            sesion.add(
                Material(
                    nombre=nombre,
                    unidad=unidades[unidad],
                    stock_actual=stock,
                    alerta_minima=alerta,
                    dias_reabastecimiento=dias,
                )
            )
    await sesion.flush()
    materiales = (await sesion.execute(select(Material))).scalars()
    return {material.nombre: material for material in materiales}


async def _obtener_productos(sesion, materiales: dict[str, Material]) -> dict[str, Producto]:
    for nombre, tipo, precio, receta in PRODUCTOS:
        existente = (
            await sesion.execute(select(Producto).where(func.lower(Producto.nombre) == nombre.lower()))
        ).scalar_one_or_none()
        if existente is not None:
            continue
        producto = Producto(nombre=nombre, tipo=tipo, precio_base=precio, receta=[])
        sesion.add(producto)
        await sesion.flush()
        for nombre_material, cantidad in receta.items():
            producto.receta.append(
                ProductoMaterial(material=materiales[nombre_material], cantidad=cantidad)
            )
    await sesion.flush()
    productos = (await sesion.execute(select(Producto))).scalars()
    return {producto.nombre: producto for producto in productos}


async def _obtener_clientes(sesion) -> dict[str, Cliente]:
    for nombre, corporativo, notas, telefono in CLIENTES:
        existente = (
            await sesion.execute(select(Cliente).where(func.lower(Cliente.nombre) == nombre.lower()))
        ).scalar_one_or_none()
        if existente is None:
            sesion.add(
                Cliente(
                    nombre=nombre,
                    es_corporativo=corporativo,
                    notas=notas,
                    telefono=telefono,
                    direccion="Jr. Simón Bolívar 945 Int. 1, Trujillo",
                )
            )
    await sesion.flush()
    clientes = (await sesion.execute(select(Cliente))).scalars()
    return {cliente.nombre: cliente for cliente in clientes}


def _datos_orden(
    cliente: Cliente,
    descripcion: str,
    materiales: list[tuple[Material, float]],
    precio: float,
    adelanto: float,
    **extra,
) -> OrdenCreateData:
    return OrdenCreateData(
        cliente_id=cliente.id,
        descripcion=f"{PREFIJO_DEMO} {descripcion}",
        fecha_entrega=date.today() + timedelta(days=7),
        materiales_estimados=[
            MaterialEstimado(material_id=material.id, cantidad=cantidad)
            for material, cantidad in materiales
        ],
        precio_total=precio,
        adelanto_pago=adelanto,
        metodo_pago=MetodoPago.EFECTIVO,
        **extra,
    )


async def _sembrar_ordenes_demo(
    sesion,
    admin: Usuario,
    usuarios: dict[str, Usuario],
    clientes: dict[str, Cliente],
    materiales: dict[str, Material],
) -> None:
    ya_existen = (
        await sesion.execute(
            select(Orden).where(Orden.descripcion.like(f"{PREFIJO_DEMO}%")).limit(1)
        )
    ).scalar_one_or_none()
    if ya_existen is not None:
        print("Órdenes demo: ya existen, se omiten.")
        return

    operario1 = usuarios["Operario de Taller 1"]
    operario2 = usuarios["Operario de Taller 2"]
    lona = materiales["Lona banner 13 oz"]
    tinta = materiales["Tinta ecosolvente"]
    vinilo = materiales["Vinilo adhesivo"]
    ojalillos = materiales["Ojalillos metálicos"]

    # 1) Pendiente, con anticipo del 50 %.
    await ordenes_service.crear_orden(
        sesion,
        _datos_orden(
            clientes["Cliente Persona Demo"],
            "Gigantografía 3x2 m en lona",
            [(lona, 6), (tinta, 0.3)],
            precio=180,
            adelanto=90,
            unidad_negocio=UnidadNegocio.GIGANTOGRAFIAS,
            items=[
                {
                    "descripcion": "Gigantografía 3x2 m",
                    "ancho_m": 3,
                    "alto_m": 2,
                    "cantidad": 1,
                    "precio_unitario": 180,
                }
            ],
        ),
        admin,
    )

    # 2) En producción, asignada a un operario.
    orden_produccion = await ordenes_service.crear_orden(
        sesion,
        _datos_orden(
            clientes["Empresa Demo S.A.C."],
            "Banner publicitario 2x1 m con ojalillos",
            [(lona, 4), (ojalillos, 16)],
            precio=130,
            adelanto=65,
            asignado_a=operario1.id,
            unidad_negocio=UnidadNegocio.IMPRENTA,
        ),
        admin,
    )
    await ordenes_service.cambiar_estado(
        sesion, orden_produccion.id, EstadoOrden.EN_PRODUCCION, operario1
    )

    # 3) Finalizada con saldo pendiente: demuestra el candado de entrega.
    orden_saldo = await ordenes_service.crear_orden(
        sesion,
        _datos_orden(
            clientes["Cliente Persona Demo"],
            "Vinilo adhesivo para vitrina",
            [(vinilo, 5)],
            precio=120,
            adelanto=60,
            asignado_a=operario2.id,
            unidad_negocio=UnidadNegocio.IMPRENTA,
        ),
        admin,
    )
    await ordenes_service.completar(
        sesion,
        orden_saldo.id,
        [MaterialEstimado(material_id=vinilo.id, cantidad=4.5)],
        operario2,
    )

    # 4) Pagada y entregada (con merma registrada).
    orden_entregada = await ordenes_service.crear_orden(
        sesion,
        _datos_orden(
            clientes["Empresa Demo S.A.C."],
            "Gigantografía 4x2 m para fachada",
            [(lona, 8), (tinta, 0.4)],
            precio=260,
            adelanto=130,
            asignado_a=operario1.id,
            unidad_negocio=UnidadNegocio.GIGANTOGRAFIAS,
        ),
        admin,
    )
    await ordenes_service.completar(
        sesion,
        orden_entregada.id,
        [MaterialEstimado(material_id=lona.id, cantidad=8.5), MaterialEstimado(material_id=tinta.id, cantidad=0.4)],
        operario1,
    )
    await ordenes_service.confirmar_pago(
        sesion, orden_entregada.id, MetodoPago.YAPE, "", admin
    )
    await ordenes_service.cambiar_estado(
        sesion, orden_entregada.id, EstadoOrden.ENTREGADA, admin
    )

    # 5) Cancelada: el stock reservado volvió al inventario.
    orden_cancelada = await ordenes_service.crear_orden(
        sesion,
        _datos_orden(
            clientes["Cliente Persona Demo"],
            "Banner 1x1 m (cancelado por el cliente)",
            [(lona, 1)],
            precio=35,
            adelanto=20,
            unidad_negocio=UnidadNegocio.IMPRENTA,
        ),
        admin,
    )
    await ordenes_service.cancelar(sesion, orden_cancelada.id, admin)

    # 6) Orden corporativa sin adelanto (excepción del RN-01 con orden de compra).
    await ordenes_service.crear_orden(
        sesion,
        _datos_orden(
            clientes["Cámara de Comercio Demo"],
            "Servicio corporativo mensual bajo orden de compra",
            [(lona, 3), (tinta, 0.2)],
            precio=95,
            adelanto=0,
            unidad_negocio=UnidadNegocio.IMPRENTA,
        ),
        admin,
    )

    print("Órdenes demo creadas: 6 (pendiente, en producción, finalizada con saldo, entregada, cancelada y corporativa).")


async def sembrar() -> None:
    async with FabricaSesiones() as sesion:
        admin = (
            await sesion.execute(select(Usuario).where(Usuario.rol == Rol.ADMIN).limit(1))
        ).scalar_one_or_none()
        if admin is None:
            raise SystemExit(
                "No existe un administrador. Ejecuta primero: python scripts/crear_admin.py"
            )

        unidades = await _obtener_unidades(sesion)
        usuarios = await _obtener_usuarios(sesion)
        materiales = await _obtener_materiales(sesion, unidades)
        productos = await _obtener_productos(sesion, materiales)
        clientes = await _obtener_clientes(sesion)
        await _sembrar_ordenes_demo(sesion, admin, usuarios, clientes, materiales)

        await sesion.commit()

    print(f"Unidades: {len(unidades)} | Usuarios: {len(usuarios)} | Materiales: {len(materiales)}")
    print(f"Productos: {len(productos)} | Clientes: {len(clientes)}")
    print(
        "\nCuentas de demostración (solo desarrollo/UAT):\n"
        f"  Administrador : admin@impresostrujillo.pe / Admin12345\n"
        f"  Subgerencia   : subgerente@impresostrujillo.pe / {CLAVE_DEMO}\n"
        f"  Secretaría    : secretaria@impresostrujillo.pe / {CLAVE_DEMO}\n"
        f"  Diseño        : diseno@impresostrujillo.pe / {CLAVE_DEMO}\n"
        f"  Operarios     : operario1@impresostrujillo.pe / {CLAVE_DEMO}\n"
    )


if __name__ == "__main__":
    asyncio.run(sembrar())
