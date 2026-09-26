import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { rolesGuard } from './roles.guard';
import { guardarUsuario } from '../services/sesion-almacen';
import { UsuarioSistema } from '../models';

function usuarioCon(rol: UsuarioSistema['rol']): UsuarioSistema {
  return { id: 1, nombre: 'Prueba', email: 'p@impresostrujillo.pe', rol, activo: true };
}

describe('rolesGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('deja pasar si el rol del usuario está permitido', () => {
    guardarUsuario(usuarioCon('admin'));
    const guard = rolesGuard('admin', 'subgerente');
    const resultado = TestBed.runInInjectionContext(() => guard());
    expect(resultado).toBe(true);
  });

  it('redirige a /ordenes si el rol no está permitido', () => {
    guardarUsuario(usuarioCon('operario'));
    const router = TestBed.inject(Router);
    const guard = rolesGuard('admin', 'subgerente');
    const resultado = TestBed.runInInjectionContext(() => guard());
    expect(resultado).toEqual(router.createUrlTree(['/ordenes']));
  });

  it('redirige a /ordenes si no hay usuario guardado', () => {
    const router = TestBed.inject(Router);
    const guard = rolesGuard('admin');
    const resultado = TestBed.runInInjectionContext(() => guard());
    expect(resultado).toEqual(router.createUrlTree(['/ordenes']));
  });
});
