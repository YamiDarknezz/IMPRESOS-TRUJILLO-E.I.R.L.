import { aFechaISO, ayerISO, formatearFecha, hoyISO, primerDiaDelMesISO } from './fechas';

describe('hoyISO', () => {
  it('devuelve la fecha de hoy en formato local AAAA-MM-DD', () => {
    const d = new Date();
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    expect(hoyISO()).toBe(`${anio}-${mes}-${dia}`);
  });
});

describe('ayerISO', () => {
  it('devuelve la fecha de ayer en formato local AAAA-MM-DD', () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    expect(ayerISO()).toBe(`${anio}-${mes}-${dia}`);
  });
});

describe('primerDiaDelMesISO', () => {
  it('devuelve el primer día del mes actual', () => {
    const d = new Date();
    const anio = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    expect(primerDiaDelMesISO()).toBe(`${anio}-${mes}-01`);
  });
});

describe('aFechaISO', () => {
  it('devuelve vacío cuando no hay fecha', () => {
    expect(aFechaISO(null)).toBe('');
    expect(aFechaISO(undefined)).toBe('');
    expect(aFechaISO('')).toBe('');
  });

  it('recorta un texto ISO con hora al solo día', () => {
    expect(aFechaISO('2026-09-18T15:30:00.000Z')).toBe('2026-09-18');
  });

  it('deja pasar un texto AAAA-MM-DD tal cual', () => {
    expect(aFechaISO('2026-09-18')).toBe('2026-09-18');
  });

  it('convierte un timestamp de Firestore ({ seconds })', () => {
    const segundos = Math.floor(Date.UTC(2026, 8, 18, 12, 0, 0) / 1000);
    expect(aFechaISO({ seconds: segundos })).toBe('2026-09-18');
  });

  it('devuelve vacío si el objeto no trae seconds', () => {
    expect(aFechaISO({})).toBe('');
  });
});

describe('formatearFecha', () => {
  it('devuelve un guion largo cuando no hay fecha', () => {
    expect(formatearFecha(null)).toBe('—');
    expect(formatearFecha(undefined)).toBe('—');
  });

  it('interpreta AAAA-MM-DD como fecha local, no UTC', () => {
    // Si se leyera como UTC, en un huso horario negativo (ej. Perú, UTC-5)
    // mostraría el día 17 en vez del 18.
    const resultado = formatearFecha('2026-09-18');
    const esperado = new Date(2026, 8, 18).toLocaleDateString('es-PE');
    expect(resultado).toBe(esperado);
  });

  it('formatea un timestamp de Firestore', () => {
    const segundos = Math.floor(Date.UTC(2026, 8, 18, 12, 0, 0) / 1000);
    const resultado = formatearFecha({ seconds: segundos });
    const esperado = new Date(segundos * 1000).toLocaleDateString('es-PE');
    expect(resultado).toBe(esperado);
  });

  it('incluye la hora cuando se pide conHora', () => {
    const segundos = Math.floor(Date.UTC(2026, 8, 18, 12, 0, 0) / 1000);
    const resultado = formatearFecha({ seconds: segundos }, true);
    const esperado = new Date(segundos * 1000).toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    expect(resultado).toBe(esperado);
  });

  it('devuelve un guion largo ante una fecha invalida', () => {
    expect(formatearFecha('no-es-una-fecha')).toBe('—');
  });
});
