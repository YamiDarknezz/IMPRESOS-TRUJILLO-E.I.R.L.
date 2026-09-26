import { mensajeDeError } from './errores';

describe('mensajeDeError', () => {
  it('devuelve el detalle que manda el backend', () => {
    const error = { error: { detail: "Se requiere un adelanto mínimo del 50%." } };
    expect(mensajeDeError(error, 'Respaldo')).toBe('Se requiere un adelanto mínimo del 50%.');
  });

  it('usa el respaldo si no hay error.detail', () => {
    expect(mensajeDeError({}, 'Respaldo')).toBe('Respaldo');
    expect(mensajeDeError(null, 'Respaldo')).toBe('Respaldo');
    expect(mensajeDeError(undefined, 'Respaldo')).toBe('Respaldo');
  });

  it('usa el respaldo si detail no es un texto', () => {
    expect(mensajeDeError({ error: { detail: 42 } }, 'Respaldo')).toBe('Respaldo');
  });

  it('usa el respaldo si detail está vacío o solo tiene espacios', () => {
    expect(mensajeDeError({ error: { detail: '' } }, 'Respaldo')).toBe('Respaldo');
    expect(mensajeDeError({ error: { detail: '   ' } }, 'Respaldo')).toBe('Respaldo');
  });
});
