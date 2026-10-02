import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let api: ApiService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    api = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpMock.verify());

  // #48: la sesión viaja en una cookie HttpOnly que pone el backend. Si el
  // cliente mandara un token desde el navegador, volveríamos al problema.
  it('no adjunta ninguna cabecera de autorización', async () => {
    const promesa = api.get('/api/unidades');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/unidades`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ status: 'success', data: [] });
    await promesa;
  });

  it('hace POST con el cuerpo indicado', async () => {
    const promesa = api.post('/api/unidades', { nombre: 'Kilogramo', abreviatura: 'kg' });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/unidades`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ nombre: 'Kilogramo', abreviatura: 'kg' });
    req.flush({ status: 'success', data: {} });
    await promesa;
  });

  it('hace PATCH con el cuerpo indicado', async () => {
    const promesa = api.patch('/api/unidades/1', { nombre: 'Kilogramo' });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/unidades/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ status: 'success', data: {} });
    await promesa;
  });

  it('hace DELETE', async () => {
    const promesa = api.delete('/api/unidades/1');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/unidades/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ status: 'success', data: {} });
    await promesa;
  });

  it('ante un 401, avisa a quien lleva la sesión y navega a /login', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const aviso = vi.fn();
    api.alExpirarSesion(aviso);

    const promesa = api.get('/api/auth/me');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/me`);
    req.flush({ detail: 'Sesión vencida' }, { status: 401, statusText: 'Unauthorized' });

    await expect(promesa).rejects.toBeTruthy();
    expect(aviso).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('el 401 del login son credenciales incorrectas, no una sesión caída', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const aviso = vi.fn();
    api.alExpirarSesion(aviso);

    const promesa = api.post('/api/auth/login', { email: 'x@y.pe', password: 'mala' });
    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
    req.flush({ detail: 'Correo o contraseña incorrectos.' }, { status: 401, statusText: 'Unauthorized' });

    await expect(promesa).rejects.toBeTruthy();
    expect(aviso).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('ante un error que no es 401, propaga sin avisar de sesión', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const aviso = vi.fn();
    api.alExpirarSesion(aviso);

    const promesa = api.get('/api/unidades');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/unidades`);
    req.flush({ detail: 'Error interno' }, { status: 500, statusText: 'Server Error' });

    await expect(promesa).rejects.toBeTruthy();
    expect(aviso).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
