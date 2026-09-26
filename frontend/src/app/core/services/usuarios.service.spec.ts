import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { UsuariosService } from './usuarios.service';
import { UsuarioSistema } from '../models';

const operario: UsuarioSistema = {
  id: 2,
  nombre: 'Luis Ramos',
  email: 'luis@impresostrujillo.pe',
  rol: 'operario',
  activo: true,
};

describe('UsuariosService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn> };
  let servicio: UsuariosService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn(), post: vi.fn(), patch: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(UsuariosService);
  });

  it('listar() pide /api/usuarios y devuelve la lista', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [operario] });
    const lista = await servicio.listar();
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/usuarios');
    expect(lista).toEqual([operario]);
  });

  it('listar() trata data ausente como lista vacía', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success' });
    expect(await servicio.listar()).toEqual([]);
  });

  it('crear() envía los datos de la cuenta nueva', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: operario });
    const datos = { nombre: 'Luis Ramos', email: 'luis@impresostrujillo.pe', password: 'Clave123', rol: 'operario' as const };

    const creado = await servicio.crear(datos);

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/usuarios', datos);
    expect(creado).toEqual(operario);
  });

  it('actualizar() usa PATCH sobre /api/usuarios/:id', async () => {
    apiFalsa.patch.mockResolvedValue({ status: 'success', data: { ...operario, activo: false } });

    const actualizado = await servicio.actualizar(2, { activo: false });

    expect(apiFalsa.patch).toHaveBeenCalledWith('/api/usuarios/2', { activo: false });
    expect(actualizado.activo).toBe(false);
  });

  it('cambiarPassword() manda ambas claves y devuelve el token nuevo', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: { access_token: 'token-nuevo' } });

    const token = await servicio.cambiarPassword('actual', 'nueva');

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/auth/password', {
      password_actual: 'actual',
      password_nueva: 'nueva',
    });
    expect(token).toBe('token-nuevo');
  });
});
