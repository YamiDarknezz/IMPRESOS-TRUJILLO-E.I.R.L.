import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { guardarSesion, leerToken } from './sesion-almacen';
import { UsuarioSistema } from '../models';

const usuario: UsuarioSistema = {
  id: 1,
  nombre: 'Ana Torres',
  email: 'ana@impresostrujillo.pe',
  rol: 'admin',
  activo: true,
};

describe('ApiService', () => {
  let api: ApiService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    api = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => httpMock.verify());

  it('hace GET sin cabecera de autorización si no hay sesión', async () => {
    const promesa = api.get('/api/unidades');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/unidades`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ status: 'success', data: [] });
    await promesa;
  });

  it('agrega el token como Bearer cuando hay sesión iniciada', async () => {
    guardarSesion('token-xyz', usuario);
    const promesa = api.get('/api/auth/me');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/me`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-xyz');
    req.flush({ status: 'success', data: usuario });
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

  it('ante un 401, limpia la sesión y navega a /login', async () => {
    guardarSesion('token-vencido', usuario);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const promesa = api.get('/api/auth/me');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/me`);
    req.flush({ detail: 'Token vencido' }, { status: 401, statusText: 'Unauthorized' });

    await expect(promesa).rejects.toBeTruthy();
    expect(leerToken()).toBe('');
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

  it('ante un error que no es 401, propaga sin tocar la sesión', async () => {
    guardarSesion('token-valido', usuario);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const promesa = api.get('/api/unidades');
    const req = httpMock.expectOne(`${environment.apiUrl}/api/unidades`);
    req.flush({ detail: 'Error interno' }, { status: 500, statusText: 'Server Error' });

    await expect(promesa).rejects.toBeTruthy();
    expect(leerToken()).toBe('token-valido');
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
