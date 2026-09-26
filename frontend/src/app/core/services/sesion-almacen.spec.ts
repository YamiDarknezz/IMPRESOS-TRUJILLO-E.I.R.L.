import { UsuarioSistema } from '../models';
import {
  guardarSesion,
  guardarUsuario,
  leerToken,
  leerUsuarioGuardado,
  limpiarSesion,
} from './sesion-almacen';

const usuario: UsuarioSistema = {
  id: 1,
  nombre: 'Ana Torres',
  email: 'ana@impresostrujillo.pe',
  rol: 'admin',
  activo: true,
};

describe('sesion-almacen', () => {
  beforeEach(() => localStorage.clear());

  it('guarda el token y el usuario juntos', () => {
    guardarSesion('token-abc', usuario);
    expect(leerToken()).toBe('token-abc');
    expect(leerUsuarioGuardado()).toEqual(usuario);
  });

  it('devuelve null si no hay usuario guardado', () => {
    expect(leerUsuarioGuardado()).toBeNull();
  });

  it('devuelve null si el usuario guardado es JSON invalido', () => {
    localStorage.setItem('it-usuario', '{esto no es json');
    expect(leerUsuarioGuardado()).toBeNull();
  });

  it('actualiza solo el usuario sin tocar el token', () => {
    guardarSesion('token-abc', usuario);
    const actualizado: UsuarioSistema = { ...usuario, nombre: 'Ana T.' };
    guardarUsuario(actualizado);
    expect(leerToken()).toBe('token-abc');
    expect(leerUsuarioGuardado()?.nombre).toBe('Ana T.');
  });

  it('limpia el token y el usuario', () => {
    guardarSesion('token-abc', usuario);
    limpiarSesion();
    expect(leerToken()).toBe('');
    expect(leerUsuarioGuardado()).toBeNull();
  });
});
