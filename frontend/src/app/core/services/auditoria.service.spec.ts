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

    expect(apiFalsa.get).toHaveBeenCalledWith('/api/auditoria');
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
