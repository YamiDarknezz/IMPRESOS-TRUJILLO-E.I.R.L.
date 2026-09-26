import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { authGuard } from './auth.guard';
import { guardarSesion } from '../services/sesion-almacen';
import { UsuarioSistema } from '../models';

const usuario: UsuarioSistema = {
  id: 1,
  nombre: 'Ana Torres',
  email: 'ana@impresostrujillo.pe',
  rol: 'admin',
  activo: true,
};

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('deja pasar si hay un token guardado', () => {
    guardarSesion('token-abc', usuario);
    const resultado = TestBed.runInInjectionContext(() => authGuard());
    expect(resultado).toBe(true);
  });

  it('redirige a /login si no hay token', () => {
    const router = TestBed.inject(Router);
    const resultado = TestBed.runInInjectionContext(() => authGuard());
    expect(resultado).toEqual(router.createUrlTree(['/login']));
  });
});
