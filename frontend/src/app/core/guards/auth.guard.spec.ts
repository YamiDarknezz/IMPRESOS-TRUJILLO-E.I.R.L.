import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { authGuard } from './auth.guard';
import { SesionService } from '../services/sesion.service';
import { UsuarioSistema } from '../models';

const usuario: UsuarioSistema = {
  id: 1,
  nombre: 'Ana Torres',
  email: 'ana@impresostrujillo.pe',
  rol: 'admin',
  activo: true,
};

describe('authGuard', () => {
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

  // #48: la puerta ya no es "hay algo guardado en el navegador" sino "el
  // servidor reconoce la sesión".
  it('pregunta el perfil al servidor antes de decidir', async () => {
    configurar(usuario);

    await TestBed.runInInjectionContext(() => authGuard());

    expect(sesionFalsa.cargar).toHaveBeenCalled();
  });

  it('deja pasar si el servidor devuelve el perfil', async () => {
    configurar(usuario);

    const resultado = await TestBed.runInInjectionContext(() => authGuard());

    expect(resultado).toBe(true);
  });

  it('redirige a /login si no hay perfil', async () => {
    configurar(null);
    const router = TestBed.inject(Router);

    const resultado = await TestBed.runInInjectionContext(() => authGuard());

    expect(resultado).toEqual(router.createUrlTree(['/login']));
  });
});
