import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginComponent } from './login';

describe('LoginComponent', () => {
  let authFalso: { login: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    authFalso = { login: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: AuthService, useValue: authFalso }],
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  it('se crea el componente', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('no llama al backend si falta correo o contraseña', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const componente = fixture.componentInstance;
    componente.email = '';
    componente.password = '';

    await componente.onLogin();

    expect(authFalso.login).not.toHaveBeenCalled();
    expect(componente.errorMessage).toBe('Ingresa tu correo y contraseña.');
  });

  it('inicia sesión y navega a /ordenes si las credenciales son correctas', async () => {
    authFalso.login.mockResolvedValue(undefined);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(LoginComponent);
    const componente = fixture.componentInstance;
    componente.email = '  ana@impresostrujillo.pe  ';
    componente.password = 'Clave123';

    await componente.onLogin();

    expect(authFalso.login).toHaveBeenCalledWith('ana@impresostrujillo.pe', 'Clave123');
    expect(navigateSpy).toHaveBeenCalledWith(['/ordenes']);
    expect(componente.loading).toBe(false);
  });

  it('muestra el mensaje del backend si las credenciales son incorrectas', async () => {
    authFalso.login.mockRejectedValue({ error: { detail: 'Correo o contraseña incorrectos.' } });
    const fixture = TestBed.createComponent(LoginComponent);
    const componente = fixture.componentInstance;
    componente.email = 'ana@impresostrujillo.pe';
    componente.password = 'mala-clave';

    await componente.onLogin();

    expect(componente.errorMessage).toBe('Correo o contraseña incorrectos.');
    expect(componente.loading).toBe(false);
  });

  it('usa un mensaje de respaldo si el backend no manda detalle', async () => {
    authFalso.login.mockRejectedValue(new Error('red caída'));
    const fixture = TestBed.createComponent(LoginComponent);
    const componente = fixture.componentInstance;
    componente.email = 'ana@impresostrujillo.pe';
    componente.password = 'Clave123';

    await componente.onLogin();

    expect(componente.errorMessage).toBe('No se pudo iniciar sesión.');
  });
});
