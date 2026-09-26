import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { FinanzasService } from './finanzas.service';
import { hoyISO, primerDiaDelMesISO } from '../../shared/utilidades/fechas';
import { ResumenFinanzas } from '../models';

const resumen: ResumenFinanzas = {
  es_supervisor: true,
  total_contratos: 10,
  total_por_cobrar: 500,
  total_ordenes: 10,
  total_ingresos: 2000,
  total_adelantos: 300,
  por_metodo: { efectivo: 1000, yape: 800, transferencia: 200 },
  por_unidad_negocio: {},
  por_trabajador: [],
};

describe('FinanzasService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn> };
  let servicio: FinanzasService;

  beforeEach(() => {
    localStorage.clear();
    apiFalsa = { get: vi.fn().mockResolvedValue({ status: 'success', data: resumen }) };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(FinanzasService);
  });

  it('arranca con el rango del mes actual por defecto', () => {
    expect(servicio.desde()).toBe(primerDiaDelMesISO());
    expect(servicio.hasta()).toBe(hoyISO());
  });

  it('cargar() pide el resumen con el rango actual como query', async () => {
    await servicio.cargar();
    expect(apiFalsa.get).toHaveBeenCalledWith(
      `/api/finanzas/resumen?desde=${servicio.desde()}&hasta=${servicio.hasta()}`,
    );
    expect(servicio.resumen()).toEqual(resumen);
  });

  it('cargar() persiste el rango elegido para la próxima visita', async () => {
    servicio.desde.set('2026-08-01');
    servicio.hasta.set('2026-08-31');

    await servicio.cargar();

    expect(localStorage.getItem('it-fin-desde')).toBe('2026-08-01');
    expect(localStorage.getItem('it-fin-hasta')).toBe('2026-08-31');
  });

  it('cargar() incluye el trabajador en la query si está seleccionado', async () => {
    servicio.trabajador.set(7);
    await servicio.cargar();
    expect(apiFalsa.get).toHaveBeenCalledWith(expect.stringContaining('trabajador=7'));
  });

  it('setMesActual() vuelve al mes en curso y recarga', async () => {
    servicio.desde.set('2020-01-01');
    await servicio.setMesActual();
    expect(servicio.desde()).toBe(primerDiaDelMesISO());
    expect(servicio.hasta()).toBe(hoyISO());
  });

  it('setHoy() deja el rango en el día de hoy', async () => {
    await servicio.setHoy();
    expect(servicio.desde()).toBe(hoyISO());
    expect(servicio.hasta()).toBe(hoyISO());
  });

  it('setTodo() vacía el rango (sin filtro de fechas)', async () => {
    await servicio.setTodo();
    expect(servicio.desde()).toBe('');
    expect(servicio.hasta()).toBe('');
    expect(apiFalsa.get).toHaveBeenLastCalledWith('/api/finanzas/resumen');
  });

  it('porMetodo() traduce las claves del backend a etiquetas legibles', async () => {
    await servicio.cargar();
    expect(servicio.porMetodo()).toEqual([
      { metodo: 'Efectivo', monto: 1000 },
      { metodo: 'Yape', monto: 800 },
      { metodo: 'Transferencia', monto: 200 },
    ]);
  });

  it('porMetodo() es una lista vacía si todavía no hay resumen', () => {
    expect(servicio.porMetodo()).toEqual([]);
  });
});
