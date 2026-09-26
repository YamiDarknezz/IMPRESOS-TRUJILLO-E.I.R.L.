import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CajaService } from '../../core/services/caja.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { SesionService } from '../../core/services/sesion.service';
import { CajaComponent } from './caja';
import { CierreCaja, DetalleCaja, ResumenCaja } from '../../core/models';

const resumen: ResumenCaja = {
  fecha: '2026-09-18',
  total: { efectivo: 100, yape: 50, transferencia: 0, total: 150 },
  por_unidad_negocio: {},
  por_usuario: [],
  detalle: [],
};

const cierre: CierreCaja = {
  id: 1,
  fecha: '2026-09-18',
  unidad_negocio: 'imprenta',
  usuario_id: 2,
  usuario: 'Ana',
  monto_efectivo: 100,
  monto_yape: 50,
  monto_transferencia: 0,
  total: 150,
  estado: 'cerrado',
  validado_por: null,
  validador: '',
  observacion: '',
  creado_en: '2026-09-18T20:00:00Z',
};

describe('CajaComponent', () => {
  let cajaFalso: {
    resumen: ReturnType<typeof vi.fn>;
    listarCierres: ReturnType<typeof vi.fn>;
    cerrar: ReturnType<typeof vi.fn>;
    congelar: ReturnType<typeof vi.fn>;
    observarPago: ReturnType<typeof vi.fn>;
  };
  let ordenesFalso: { crearVentaRapida: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    cajaFalso = {
      resumen: vi.fn().mockResolvedValue(resumen),
      listarCierres: vi.fn().mockResolvedValue([cierre]),
      cerrar: vi.fn().mockResolvedValue(cierre),
      congelar: vi.fn().mockResolvedValue(cierre),
      observarPago: vi.fn().mockResolvedValue({}),
    };
    ordenesFalso = { crearVentaRapida: vi.fn().mockResolvedValue({}) };
    TestBed.configureTestingModule({
      imports: [CajaComponent],
      providers: [
        { provide: CajaService, useValue: cajaFalso },
        { provide: OrdenesService, useValue: ordenesFalso },
        { provide: SesionService, useValue: { esSupervisor: signal(true) } },
      ],
    });
  });

  it('al crearse, carga el resumen y los cierres del día', () => {
    TestBed.createComponent(CajaComponent);
    expect(cajaFalso.resumen).toHaveBeenCalledTimes(1);
    expect(cajaFalso.listarCierres).toHaveBeenCalledTimes(1);
  });

  it('cambiarFecha() recarga con la nueva fecha', () => {
    const fixture = TestBed.createComponent(CajaComponent);
    fixture.componentInstance.cambiarFecha('2026-09-01');
    expect(fixture.componentInstance.fecha()).toBe('2026-09-01');
    expect(cajaFalso.resumen).toHaveBeenLastCalledWith('2026-09-01', '');
  });

  it('cambiarUnidad() recarga filtrando por unidad de negocio', () => {
    const fixture = TestBed.createComponent(CajaComponent);
    fixture.componentInstance.cambiarUnidad('imprenta');
    expect(fixture.componentInstance.unidad()).toBe('imprenta');
    expect(cajaFalso.resumen).toHaveBeenLastCalledWith(fixture.componentInstance.fecha(), 'imprenta');
  });

  it('cerrarCaja(): pide confirmación antes de cerrar', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const fixture = TestBed.createComponent(CajaComponent);

    await fixture.componentInstance.cerrarCaja('imprenta');

    expect(cajaFalso.cerrar).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('cerrarCaja(): confirmado, cierra y recarga', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(CajaComponent);

    await fixture.componentInstance.cerrarCaja('imprenta');

    expect(cajaFalso.cerrar).toHaveBeenCalledWith(fixture.componentInstance.fecha(), 'imprenta');
    confirmSpy.mockRestore();
  });

  it('congelar(): confirmado, congela el cierre indicado', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(CajaComponent);

    await fixture.componentInstance.congelar(cierre);

    expect(cajaFalso.congelar).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });

  it('montoDe() lee el monto del método indicado del acumulado', () => {
    const fixture = TestBed.createComponent(CajaComponent);
    expect(fixture.componentInstance.montoDe(resumen.total, 'efectivo')).toBe(100);
    expect(fixture.componentInstance.montoDe(resumen.total, 'transferencia')).toBe(0);
  });

  describe('observación de cobros', () => {
    const detalle: DetalleCaja = {
      pago_id: 9,
      orden: 'C-0001',
      orden_id: 1,
      cliente: 'Juan Pérez',
      unidad_negocio: 'imprenta',
      metodo: 'yape',
      tipo: 'adelanto',
      monto: 100,
      fecha: '2026-09-18',
      usuario_id: 2,
    };

    it('abrirModalObservar() prepara el modal con valores por defecto', () => {
      const fixture = TestBed.createComponent(CajaComponent);
      fixture.componentInstance.abrirModalObservar(detalle);
      expect(fixture.componentInstance.pagoAObservar()).toEqual(detalle);
      expect(fixture.componentInstance.motivoObservacion()).toBe('yape_falso');
    });

    it('guardarObservacion(): sin pago seleccionado, no hace nada', async () => {
      const fixture = TestBed.createComponent(CajaComponent);
      await fixture.componentInstance.guardarObservacion();
      expect(cajaFalso.observarPago).not.toHaveBeenCalled();
    });

    it('guardarObservacion(): envía motivo y nota, y cierra el modal', async () => {
      const fixture = TestBed.createComponent(CajaComponent);
      const componente = fixture.componentInstance;
      componente.abrirModalObservar(detalle);
      componente.motivoObservacion.set('billete_falso');
      componente.notaObservacion.set('No coincide la serie');

      await componente.guardarObservacion();

      expect(cajaFalso.observarPago).toHaveBeenCalledWith(9, {
        motivo: 'billete_falso',
        nota: 'No coincide la serie',
      });
      expect(componente.pagoAObservar()).toBeNull();
    });
  });

  describe('venta rápida / mostrador', () => {
    it('guardarVentaRapida(): exige descripción', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(CajaComponent);
      fixture.componentInstance.vrMonto.set(20);

      await fixture.componentInstance.guardarVentaRapida();

      expect(ordenesFalso.crearVentaRapida).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Ingresa la descripción del servicio o producto rápido.');
      alertSpy.mockRestore();
    });

    it('guardarVentaRapida(): exige un monto mayor a 0', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(CajaComponent);
      const componente = fixture.componentInstance;
      componente.vrDescripcion.set('Copias');
      componente.vrMonto.set(0);

      await componente.guardarVentaRapida();

      expect(ordenesFalso.crearVentaRapida).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Ingresa un monto válido mayor a 0.');
      alertSpy.mockRestore();
    });

    it('guardarVentaRapida(): con datos válidos, crea la venta y cierra el modal', async () => {
      const fixture = TestBed.createComponent(CajaComponent);
      const componente = fixture.componentInstance;
      componente.abrirModalVentaRapida();
      componente.vrDescripcion.set('Copias');
      componente.vrMonto.set(15);

      await componente.guardarVentaRapida();

      expect(ordenesFalso.crearVentaRapida).toHaveBeenCalledWith(
        expect.objectContaining({ descripcion: 'Copias', monto_total: 15 }),
      );
      expect(componente.modalVentaRapida()).toBe(false);
    });
  });
});
