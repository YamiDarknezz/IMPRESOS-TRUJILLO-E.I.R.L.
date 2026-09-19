/**
 * Utilidades de fecha.
 *
 * Las fechas llegan en dos formas: como texto 'AAAA-MM-DD' (fecha de entrega,
 * que el usuario elige) o como timestamp de Firestore `{ seconds }` (fecha de
 * creación). Estas funciones tratan ambas por igual.
 */

/** Fecha de hoy en formato 'AAAA-MM-DD'. */
export function hoyISO(): string {
  return new Date().toISOString().split('T')[0];
}

/** Primer día del mes actual en formato 'AAAA-MM-DD'. */
export function primerDiaDelMesISO(): string {
  const d = new Date();
  const anio = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${anio}-${mes}-01`;
}

/** Lleva cualquiera de las dos formas a 'AAAA-MM-DD', para poder comparar. */
export function aFechaISO(fecha: unknown): string {
  if (!fecha) return '';
  if (typeof fecha === 'string') return fecha.split('T')[0];

  const segundos = (fecha as { seconds?: number })?.seconds;
  return segundos ? new Date(segundos * 1000).toISOString().split('T')[0] : '';
}

/**
 * Formatea una fecha para mostrarla en pantalla, en formato peruano.
 *
 * Un texto 'AAAA-MM-DD' se interpreta como fecha LOCAL a propósito: si se
 * dejara a `new Date()`, lo leería como UTC y en Perú (UTC-5) mostraría el
 * día anterior.
 */
export function formatearFecha(fecha: unknown, conHora = false): string {
  if (!fecha) return '—';

  let d: Date | null = null;

  if (typeof fecha === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [anio, mes, dia] = fecha.split('-').map(Number);
      d = new Date(anio, mes - 1, dia);
    } else {
      d = new Date(fecha);
    }
  } else {
    const segundos = (fecha as { seconds?: number })?.seconds;
    if (segundos) d = new Date(segundos * 1000);
  }

  if (!d || isNaN(d.getTime())) return '—';

  return conHora
    ? d.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })
    : d.toLocaleDateString('es-PE');
}
