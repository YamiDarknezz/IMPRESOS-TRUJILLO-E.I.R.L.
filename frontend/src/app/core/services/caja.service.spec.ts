import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { CajaService } from './caja.service';
import { ResumenCaja } from '../models';

const resumen: ResumenCaja = {
  fecha: '2026-09-18',
  total: { efectivo: 100, yape: 50, transferencia: 0, total: 150 },
  por_unidad_negocio: {},
  por_usuario: [],
  detalle: [],
};

describe('CajaService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn> };
  let servicio: CajaService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn(), post: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(CajaService);
  });

  it('resumen() pide el arqueo de la fecha indicada', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: resumen });
    const r = await servicio.resumen('2026-09-18');
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/caja/resumen?fecha=2026-09-18');
    expect(r).toEqual(resumen);
  });

  it('resumen() agrega la unidad de negocio si se indica', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: resumen });
    await servicio.resumen('2026-09-18', 'imprenta');
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/caja/resumen?fecha=2026-09-18&unidad_negocio=imprenta');
  });

  it('listarCierres() sin filtros no agrega query', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });
    await servicio.listarCierres();
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/caja');
  });

  it('listarCierres() arma la query con fecha y unidad', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });
    await servicio.listarCierres('2026-09-18', 'gigantografias');
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/caja?fecha=2026-09-18&unidad_negocio=gigantografias');
  });

  it('cerrar() postea fecha, unidad y observación', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    await servicio.cerrar('2026-09-18', 'imprenta', 'Todo cuadrado');
    expect(apiFalsa.post).toHaveBeenCalledWith('/api/caja/cerrar', {
      fecha: '2026-09-18',
      unidad_negocio: 'imprenta',
      observacion: 'Todo cuadrado',
    });
  });

  it('congelar() postea al cierre indicado', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    await servicio.congelar(9, 'Validado por gerencia');
    expect(apiFalsa.post).toHaveBeenCalledWith('/api/caja/9/congelar', { observacion: 'Validado por gerencia' });
  });

  it('observarPago() postea el motivo y la nota', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    await servicio.observarPago(5, { motivo: 'yape_falso', nota: 'Voucher no coincide' });
    expect(apiFalsa.post).toHaveBeenCalledWith('/api/caja/pagos/5/observar', {
      motivo: 'yape_falso',
      nota: 'Voucher no coincide',
    });
  });
});
