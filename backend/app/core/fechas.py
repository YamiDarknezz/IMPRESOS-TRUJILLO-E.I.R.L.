"""Utilidades de fecha en hora local de Perú.

La base guarda todo en UTC. Los reportes y cierres de caja del negocio se
cortan por día peruano, así que la conversión tiene que ser explícita y estar
en un solo lugar: si se calcula mal, los totales de un día caen en el día
equivocado.
"""
from datetime import date, datetime, time, timedelta, timezone
from typing import Optional

from app.core.config import settings

ZONA_PERU = timezone(timedelta(hours=settings.peru_utc_offset_horas), name="America/Lima")


def ahora_utc() -> datetime:
    """Momento actual en UTC, que es como se guarda todo en la base."""
    return datetime.now(timezone.utc)


def a_fecha_peru(momento: Optional[datetime]) -> Optional[date]:
    """Convierte un timestamp UTC a la fecha del calendario peruano."""
    if momento is None:
        return None
    if momento.tzinfo is None:
        # SQLite pierde la zona; se asume UTC, que es como se escribe siempre.
        momento = momento.replace(tzinfo=timezone.utc)
    return momento.astimezone(ZONA_PERU).date()


def parsear_fecha(texto: Optional[str]) -> Optional[date]:
    """Convierte 'AAAA-MM-DD' a date. Devuelve None si viene vacío."""
    return datetime.strptime(texto, "%Y-%m-%d").date() if texto else None


def dentro_del_rango(
    momento: Optional[datetime],
    desde: Optional[date],
    hasta: Optional[date],
) -> bool:
    """¿El timestamp cae dentro del rango de fechas peruanas [desde, hasta]?"""
    fecha = a_fecha_peru(momento)
    if fecha is None:
        return desde is None and hasta is None
    if desde and fecha < desde:
        return False
    if hasta and fecha > hasta:
        return False
    return True


def rango_dia_peru_a_utc(fecha: date) -> tuple[datetime, datetime]:
    """
    Convierte un día peruano a su intervalo [inicio, fin) en UTC.

    Se usa para filtrar por fecha los eventos guardados en UTC (por ejemplo,
    los pagos del día para el arqueo de caja).
    """
    inicio_peru = datetime.combine(fecha, time(0, 0), tzinfo=ZONA_PERU)
    fin_peru = inicio_peru + timedelta(days=1)
    return inicio_peru.astimezone(timezone.utc), fin_peru.astimezone(timezone.utc)
