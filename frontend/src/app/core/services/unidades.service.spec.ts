import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { UnidadesService } from './unidades.service';
import { Unidad } from '../models';

const kilogramo: Unidad = { id: 1, nombre: 'Kilogramo', abreviatura: 'kg', activo: true };

describe('UnidadesService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let servicio: UnidadesService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(UnidadesService);
  });

  it('cargar() pide /api/unidades y llena la señal', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [kilogramo] });
    await servicio.cargar();
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/unidades');
    expect(servicio.unidades()).toEqual([kilogramo]);
  });

  it('existe() distingue por nombre exacto', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [kilogramo] });
    await servicio.cargar();
    expect(servicio.existe('Kilogramo')).toBe(true);
    expect(servicio.existe('Litro')).toBe(false);
  });

  it('crear() envía nombre y abreviatura, y recarga la lista', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [kilogramo] });

    await servicio.crear('Kilogramo', 'kg');

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/unidades', { nombre: 'Kilogramo', abreviatura: 'kg' });
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/unidades');
  });

  it('actualizar() usa PATCH sobre /api/unidades/:id', async () => {
    apiFalsa.patch.mockResolvedValue({ status: 'success', data: {} });
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });

    await servicio.actualizar(1, 'Kilo', 'kg');

    expect(apiFalsa.patch).toHaveBeenCalledWith('/api/unidades/1', { nombre: 'Kilo', abreviatura: 'kg' });
  });

  it('eliminar() usa DELETE sobre /api/unidades/:id', async () => {
    apiFalsa.delete.mockResolvedValue({ status: 'success', data: {} });
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });

    await servicio.eliminar(1);

    expect(apiFalsa.delete).toHaveBeenCalledWith('/api/unidades/1');
  });
});
