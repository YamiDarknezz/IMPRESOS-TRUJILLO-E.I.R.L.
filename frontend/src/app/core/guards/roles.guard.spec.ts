import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { rolesGuard } from './roles.guard';
import { SesionService } from '../services/sesion.service';
import { UsuarioSistema } from '../models';

function usuarioCon(rol: UsuarioSistema['rol']): UsuarioSistema {
  return { id: 1, nombre: 'Prueba', email: 'p@impresostrujillo.pe', rol, activo: true };
}

describe('rolesGuard', () => {
  let sesionFalsa: {
    usuario: ReturnType<typeof signal<UsuarioSistema | null>>;
    cargar: ReturnType<typeof vi.fn>;
  };

  function configurar(perfil: UsuarioSistema | null) {
    sesionFalsa = {
      usuario: signal(perfil),
      cargar: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: SesionService, useValue: sesionFalsa }],
    });
  }

  // #48: el rol sale del perfil del servidor. Antes bastaba con escribir
  // `{"rol":"admin"}` en el localStorage para abrir estas pantallas.
  it('pide el perfil al servidor en vez de leer el rol del navegador', async () => {
    configurar(usuarioCon('admin'));

    await TestBed.runInInjectionContext(() => rolesGuard('admin')());

    expect(sesionFalsa.cargar).toHaveBeenCalled();
  });

  it('deja pasar si el rol del perfil está permitido', async () => {
    configurar(usuarioCon('admin'));

    const resultado = await TestBed.runInInjectionContext(() => rolesGuard('admin', 'subgerente')());

    expect(resultado).toBe(true);
  });

  it('redirige a /ordenes si el rol no está permitido', async () => {
    configurar(usuarioCon('operario'));
    const router = TestBed.inject(Router);

    const resultado = await TestBed.runInInjectionContext(() => rolesGuard('admin', 'subgerente')());

    expect(resultado).toEqual(router.createUrlTree(['/ordenes']));
  });

  it('redirige a /ordenes si no hay perfil', async () => {
    configurar(null);
    const router = TestBed.inject(Router);

    const resultado = await TestBed.runInInjectionContext(() => rolesGuard('admin')());

    expect(resultado).toEqual(router.createUrlTree(['/ordenes']));
  });
});
