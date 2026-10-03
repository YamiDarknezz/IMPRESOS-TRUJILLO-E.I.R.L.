import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { CajaService } from '../../core/services/caja.service';
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
    registrarGasto: ReturnType<typeof vi.fn>;
    eliminarGasto: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    cajaFalso = {
      resumen: vi.fn().mockResolvedValue(resumen),
      listarCierres: vi.fn().mockResolvedValue([cierre]),
      cerrar: vi.fn().mockResolvedValue(cierre),
      congelar: vi.fn().mockResolvedValue(cierre),
      observarPago: vi.fn().mockResolvedValue({}),
      registrarGasto: vi.fn().mockResolvedValue({}),
      eliminarGasto: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [CajaComponent],
      providers: [
        provideRouter([]),
        { provide: CajaService, useValue: cajaFalso },
        { provide: SesionService, useValue: { esSupervisor: signal(true), puedeVender: signal(true) } },
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

  // Issue #38: el modal de observación es un diálogo accesible y Escape lo cierra.
  it('observar cobro: es un diálogo y Escape lo cierra', async () => {
    cajaFalso.listarCierres.mockResolvedValue([]); // solo interesa el modal, no la tabla de cierres
    const fixture = TestBed.createComponent(CajaComponent);
    await fixture.whenStable(); // espera el resumen: la plantilla lo da por cargado
    fixture.componentInstance.abrirModalObservar({
      pago_id: 9, orden: 'C-0001', orden_id: 1, cliente: 'Juan Pérez', unidad_negocio: 'imprenta',
      metodo: 'yape', tipo: 'adelanto', monto: 100, fecha: '2026-09-18', usuario_id: 2,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.pagoAObservar()).toBeNull();
  });

  // Issue #112: los gastos del día restan del arqueo.
  describe('gastos de caja', () => {
    it('abrirModalGasto() parte vacío y usa la unidad filtrada', () => {
      const componente = TestBed.createComponent(CajaComponent).componentInstance;
      componente.cambiarUnidad('gigantografias');
      componente.gastoMotivo.set('algo viejo');

      componente.abrirModalGasto();

      expect(componente.modalGasto()).toBe(true);
      expect(componente.gastoMotivo()).toBe('');
      expect(componente.gastoMonto()).toBeNull();
      expect(componente.gastoUnidad()).toBe('gigantografias');
    });

    it('guardarGasto(): exige el motivo y un monto mayor a 0', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const componente = TestBed.createComponent(CajaComponent).componentInstance;
      componente.gastoMonto.set(10);
      await componente.guardarGasto();
      expect(alertSpy).toHaveBeenLastCalledWith('Indica en qué se gastó.');

      componente.gastoMotivo.set('Tinta');
      componente.gastoMonto.set(0);
      await componente.guardarGasto();
      expect(alertSpy).toHaveBeenLastCalledWith('Ingresa un monto válido mayor a 0.');

      expect(cajaFalso.registrarGasto).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('guardarGasto(): lo anota en el día que se mira, cierra el modal y recarga', async () => {
      const fixture = TestBed.createComponent(CajaComponent);
      const componente = fixture.componentInstance;
      componente.cambiarFecha('2026-09-18');
      componente.abrirModalGasto();
      componente.gastoMotivo.set('  Papel bond ');
      componente.gastoMonto.set(15.5);
      cajaFalso.resumen.mockClear();

      await componente.guardarGasto();

      expect(cajaFalso.registrarGasto).toHaveBeenCalledWith({
        monto: 15.5,
        motivo: 'Papel bond',
        unidad_negocio: 'imprenta',
        fecha: '2026-09-18',
      });
      expect(componente.modalGasto()).toBe(false);
      expect(cajaFalso.resumen).toHaveBeenCalled();
    });

    it('guardarGasto(): si el servidor lo rechaza, avisa y el modal sigue abierto', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      cajaFalso.registrarGasto.mockRejectedValue(new Error('Ya cerraste tu caja'));
      const componente = TestBed.createComponent(CajaComponent).componentInstance;
      componente.abrirModalGasto();
      componente.gastoMotivo.set('Tinta');
      componente.gastoMonto.set(5);

      await componente.guardarGasto();

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(componente.modalGasto()).toBe(true);
      alertSpy.mockRestore();
    });

    it('eliminarGasto(): pide confirmación antes de quitarlo', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const componente = TestBed.createComponent(CajaComponent).componentInstance;
      const gasto = { id: 4, fecha: '2026-09-18', unidad_negocio: 'imprenta' as const, monto: 9, motivo: 'Tinta', usuario_id: 1, usuario_nombre: 'Ana' };

      await componente.eliminarGasto(gasto);
      expect(cajaFalso.eliminarGasto).not.toHaveBeenCalled();

      confirmSpy.mockReturnValue(true);
      await componente.eliminarGasto(gasto);
      expect(cajaFalso.eliminarGasto).toHaveBeenCalledWith(4);
      confirmSpy.mockRestore();
    });
  });
});
