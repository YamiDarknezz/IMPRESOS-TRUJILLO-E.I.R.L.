"""Helpers compartidos por las pruebas."""
from datetime import date

from app.models import MetodoPago
from app.schemas import MaterialEstimado, OrdenCreateData


def datos_orden(material_id: int, **overrides) -> OrdenCreateData:
    """Payload base de una orden para pruebas, con overrides puntuales."""
    base = dict(
        cliente="Cliente Prueba",
        descripcion="Gigantografía 3x2",
        fecha_entrega=date(2026, 10, 1),
        materiales_estimados=[MaterialEstimado(material_id=material_id, cantidad=2)],
        precio_total=100,
        adelanto_pago=50,
        metodo_pago=MetodoPago.EFECTIVO,
    )
    base.update(overrides)
    return OrdenCreateData(**base)


def cabecera_token(usuario) -> dict:
    """Encabezado Authorization listo para las pruebas de API."""
    from app.core.security import crear_token

    return {"Authorization": f"Bearer {crear_token(usuario)}"}
