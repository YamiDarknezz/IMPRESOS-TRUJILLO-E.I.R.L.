import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { SesionService } from './sesion.service';
import { leerToken, leerUsuarioGuardado } from './sesion-almacen';
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
  let sesionFalsa: { reiniciar: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    apiFalsa = { post: vi.fn() };
    sesionFalsa = { reiniciar: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ApiService, useValue: apiFalsa },
        { provide: SesionService, useValue: sesionFalsa },
      ],
    });
  });

  it('login(): guarda el token y el usuario, y reinicia la sesión', async () => {
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
    expect(leerToken()).toBe('token-abc');
    expect(leerUsuarioGuardado()).toEqual(usuario);
    expect(sesionFalsa.reiniciar).toHaveBeenCalledTimes(1);
  });

  it('login(): si el backend rechaza, no guarda nada y propaga el error', async () => {
    apiFalsa.post.mockRejectedValue(new Error('Correo o contraseña incorrectos.'));
    const auth = TestBed.inject(AuthService);

    await expect(auth.login('ana@impresostrujillo.pe', 'mala-clave')).rejects.toThrow(
      'Correo o contraseña incorrectos.',
    );
    expect(leerToken()).toBe('');
    expect(sesionFalsa.reiniciar).not.toHaveBeenCalled();
  });

  it('cerrarSesion(): limpia la sesión, la reinicia y navega a /login', () => {
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    auth.cerrarSesion();

    expect(leerToken()).toBe('');
    expect(sesionFalsa.reiniciar).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
