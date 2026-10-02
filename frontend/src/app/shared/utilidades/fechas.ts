/**
 * Utilidades de fecha.
 *
 * Las fechas llegan en dos formas: como texto 'AAAA-MM-DD' (fecha de entrega,
 * que el usuario elige, o un día ya de calendario) o como timestamp con hora
 * e instante (fecha de creación, siempre en UTC porque así lo guarda el
 * backend). Estas funciones tratan ambas por igual.
 */

/**
 * Huso del negocio. La base guarda todo en UTC y el día de calendario que
 * importa —filtros, reportes, arqueos— es el peruano: convertir un instante a
 * "su día" tomando el texto en UTC le pone la fecha del día siguiente a todo
 * lo creado de noche.
 */
const ZONA_PERU = 'America/Lima';

/** Día de calendario peruano ('AAAA-MM-DD') de un instante. No depende del huso del equipo. */
export function diaPeruISO(instante: Date): string {
  // 'en-CA' formatea como AAAA-MM-DD, que es lo que se compara en los filtros.
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_PERU }).format(instante);
}

/** Fecha de hoy en formato local 'AAAA-MM-DD' (evita desfases por UTC en husos horarios como Perú UTC-5). */
export function hoyISO(): string {
  const d = new Date();
  const anio = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/** Fecha de ayer en formato local 'AAAA-MM-DD'. */
export function ayerISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const anio = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/** Primer día del mes actual en formato 'AAAA-MM-DD'. */
export function primerDiaDelMesISO(): string {
  const d = new Date();
  const anio = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${anio}-${mes}-01`;
}

/**
 * Lleva cualquiera de las dos formas a 'AAAA-MM-DD', para poder comparar.
 *
 * Un texto 'AAAA-MM-DD' ya es un día de calendario y se devuelve tal cual; un
 * instante (ISO con hora o timestamp `{ seconds }`) se convierte al día
 * peruano. Tomar el día del texto UTC —lo que hacía antes— fechaba al día
 * siguiente todo lo creado después de las 19:00 hora de Perú.
 */
export function aFechaISO(fecha: unknown): string {
  if (!fecha) return '';

  if (typeof fecha === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;

    const instante = new Date(fecha);
    return isNaN(instante.getTime()) ? fecha.split('T')[0] : diaPeruISO(instante);
  }

  const segundos = (fecha as { seconds?: number })?.seconds;
  return segundos ? diaPeruISO(new Date(segundos * 1000)) : '';
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
