import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { SesionService } from './sesion.service';
import { UsuarioSistema } from '../models';

const usuario: UsuarioSistema = {
  id: 1,
  nombre: 'Ana Torres',
  email: 'ana@impresostrujillo.pe',
  rol: 'admin',
  activo: true,
};

describe('AuthService', () => {
  let apiFalsa: { post: ReturnType<typeof vi.fn> };
  let sesionFalsa: { reiniciar: ReturnType<typeof vi.fn>; cargar: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    apiFalsa = { post: vi.fn() };
    sesionFalsa = { reiniciar: vi.fn(), cargar: vi.fn().mockResolvedValue(undefined) };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiFalsa },
        { provide: SesionService, useValue: sesionFalsa },
      ],
    });
  });

  // #48: el token ya no pasa por el navegador; lo deja el backend en una
  // cookie HttpOnly. Aquí solo se pide el perfil para saber quién entró.
  it('login(): no guarda nada y pide el perfil al servidor', async () => {
    apiFalsa.post.mockResolvedValue({
      status: 'success',
      data: { access_token: 'token-abc', token_type: 'bearer', usuario },
    });
    const auth = TestBed.inject(AuthService);

    await auth.login('ana@impresostrujillo.pe', 'Clave123');

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/auth/login', {
      email: 'ana@impresostrujillo.pe',
      password: 'Clave123',
    });
    expect(localStorage.getItem('it-token')).toBeNull();
    expect(localStorage.getItem('it-usuario')).toBeNull();
    expect(sesionFalsa.reiniciar).toHaveBeenCalledTimes(1);
    expect(sesionFalsa.cargar).toHaveBeenCalledTimes(1);
  });

  it('login(): si el backend rechaza, no toca la sesión y propaga el error', async () => {
    apiFalsa.post.mockRejectedValue(new Error('Correo o contraseña incorrectos.'));
    const auth = TestBed.inject(AuthService);

    await expect(auth.login('ana@impresostrujillo.pe', 'mala-clave')).rejects.toThrow(
      'Correo o contraseña incorrectos.',
    );
    expect(sesionFalsa.reiniciar).not.toHaveBeenCalled();
  });

  // El navegador no puede borrar una cookie HttpOnly: si no se llama al
  // backend, la sesión seguiría viva aunque la interfaz la olvide.
  it('cerrarSesion(): revoca en el servidor antes de volver al login', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success' });
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await auth.cerrarSesion();

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/auth/logout');
    expect(sesionFalsa.reiniciar).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('cerrarSesion(): aunque el servidor falle, la interfaz no queda abierta', async () => {
    apiFalsa.post.mockRejectedValue(new Error('sin conexión'));
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    await auth.cerrarSesion();

    expect(sesionFalsa.reiniciar).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
