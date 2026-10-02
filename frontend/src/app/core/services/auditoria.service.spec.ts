import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { AuditoriaService } from './auditoria.service';
import { EntradaAuditoria } from '../models';

const entrada: EntradaAuditoria = {
  id: 1,
  usuario_id: 1,
  usuario: 'Ana Torres',
  accion: 'crear',
  tabla_afectada: 'clientes',
  registro_id: '3',
  detalle: 'Creó un cliente',
  ip: '127.0.0.1',
  fecha: '2026-09-18T10:00:00Z',
};

describe('AuditoriaService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn> };
  let servicio: AuditoriaService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(AuditoriaService);
  });

  it('cargar() llena las entradas y apaga sinPermiso', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [entrada] });

    await servicio.cargar();

    expect(apiFalsa.get).toHaveBeenCalledWith('/api/auditoria?limit=100&offset=0');
    expect(servicio.entradas()).toEqual([entrada]);
    expect(servicio.sinPermiso()).toBe(false);
    expect(servicio.cargando()).toBe(false);
  });

  it('ante un 403, marca sinPermiso y no lanza', async () => {
    apiFalsa.get.mockRejectedValue({ status: 403 });

    await expect(servicio.cargar()).resolves.toBeUndefined();
    expect(servicio.sinPermiso()).toBe(true);
    expect(servicio.entradas()).toEqual([]);
  });

  it('ante un 401, también marca sinPermiso', async () => {
    apiFalsa.get.mockRejectedValue({ status: 401 });

    await servicio.cargar();

    expect(servicio.sinPermiso()).toBe(true);
  });

  it('ante otro error, lo propaga en vez de tratarlo como falta de permiso', async () => {
    apiFalsa.get.mockRejectedValue({ status: 500 });

    await expect(servicio.cargar()).rejects.toEqual({ status: 500 });
    expect(servicio.sinPermiso()).toBe(false);
    expect(servicio.cargando()).toBe(false);
  });
});

describe('AuditoriaService: historial completo (#28)', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn> };
  let servicio: AuditoriaService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(AuditoriaService);
  });

  it('informa cuántas acciones hay, además del bloque que muestra', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [entrada], total: 250 });

    await servicio.cargar();

    expect(servicio.total()).toBe(250);
    expect(servicio.hayMas()).toBe(true);
  });

  it('cargarMas() pide desde donde se quedó y agrega las nuevas', async () => {
    const otra = { ...entrada, id: 2 };
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [entrada], total: 2 });
    await servicio.cargar();

    apiFalsa.get.mockResolvedValue({ status: 'success', data: [otra], total: 2 });
    await servicio.cargarMas();

    expect(apiFalsa.get).toHaveBeenLastCalledWith('/api/auditoria?limit=100&offset=1');
    expect(servicio.entradas().map(e => e.id)).toEqual([1, 2]);
    expect(servicio.hayMas()).toBe(false);
  });

  it('los filtros viajan al servidor, no se aplican sobre lo ya cargado', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [], total: 0 });

    await servicio.filtrar({ accion: 'eliminar', desde: '2026-09-01', hasta: '2026-09-30' });

    expect(apiFalsa.get).toHaveBeenCalledWith(
      '/api/auditoria?limit=100&offset=0&accion=eliminar&desde=2026-09-01&hasta=2026-09-30'
    );
    expect(servicio.hayFiltros()).toBe(true);
  });

  it('limpiarFiltros() vuelve al historial completo', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [], total: 0 });
    await servicio.filtrar({ accion: 'eliminar' });

    await servicio.limpiarFiltros();

    expect(apiFalsa.get).toHaveBeenLastCalledWith('/api/auditoria?limit=100&offset=0');
    expect(servicio.hayFiltros()).toBe(false);
  });
});
