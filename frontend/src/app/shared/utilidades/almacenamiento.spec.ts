import { borrarPreferencia, guardarPreferencia, leerPreferencia } from './almacenamiento';

describe('almacenamiento (localStorage sin excepciones)', () => {
  beforeEach(() => localStorage.clear());

  it('guarda y lee una preferencia', () => {
    guardarPreferencia('clave-1', 'valor-1');
    expect(leerPreferencia('clave-1')).toBe('valor-1');
  });

  it('devuelve el valor por defecto si la clave no existe', () => {
    expect(leerPreferencia('no-existe')).toBe('');
    expect(leerPreferencia('no-existe', 'defecto')).toBe('defecto');
  });

  it('borra una preferencia guardada', () => {
    guardarPreferencia('clave-2', 'valor-2');
    borrarPreferencia('clave-2');
    expect(leerPreferencia('clave-2')).toBe('');
  });

  it('no lanza si localStorage.getItem falla', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(leerPreferencia('cualquiera', 'defecto')).toBe('defecto');
    spy.mockRestore();
  });

  it('no lanza si localStorage.setItem falla', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(() => guardarPreferencia('clave-3', 'valor-3')).not.toThrow();
    spy.mockRestore();
  });

  it('no lanza si localStorage.removeItem falla', () => {
    const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    expect(() => borrarPreferencia('clave-4')).not.toThrow();
    spy.mockRestore();
  });
});
