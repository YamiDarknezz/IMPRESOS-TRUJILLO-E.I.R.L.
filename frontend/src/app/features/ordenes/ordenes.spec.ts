import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { OrdenesService } from '../../core/services/ordenes.service';
import { SesionService } from '../../core/services/sesion.service';
import { OrdenesComponent } from './ordenes';
import { Orden } from '../../core/models';

function ordenBase(sobrescribe: Partial<Orden> = {}): Orden {
  return {
    id: 1,
    id_documento: 'C-0001',
    codigo: 'C-0001',
    tipo_documento: 'contrato',
    unidad_negocio: 'imprenta',
    cliente_id: 1,
    cliente: 'Juan Pérez',
    direccion: '',
    telefono: '',
    descripcion: 'Banners',
    estado: 'pendiente',
    fecha_creacion: '2026-09-01',
    fecha_entrega: '2026-12-31',
    creado_por: 1,
    asignado_a: null,
    asignado: '',
    incluye_igv: true,
    subtotal: 100,
    igv: 18,
    items: [],
    ...sobrescribe,
  };
}

describe('OrdenesComponent', () => {
  let ordenesFalso: {
    ordenes: ReturnType<typeof signal<Orden[]>>;
    cargando: ReturnType<typeof signal<boolean>>;
    enProceso: ReturnType<typeof signal<number>>;
    finalizadas: ReturnType<typeof signal<number>>;
    vencidas: ReturnType<typeof signal<number>>;
    porCobrar: ReturnType<typeof signal<number>>;
    cargar: ReturnType<typeof vi.fn>;
    cambiarEstado: ReturnType<typeof vi.fn>;
    asignar: ReturnType<typeof vi.fn>;
    cancelar: ReturnType<typeof vi.fn>;
    completar: ReturnType<typeof vi.fn>;
    confirmarPago: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    ordenesFalso = {
      ordenes: signal([ordenBase()]),
      cargando: signal(false),
      enProceso: signal(1),
      finalizadas: signal(0),
      vencidas: signal(0),
      porCobrar: signal(0),
      cargar: vi.fn().mockResolvedValue(undefined),
      cambiarEstado: vi.fn().mockResolvedValue(undefined),
      asignar: vi.fn().mockResolvedValue(undefined),
      cancelar: vi.fn().mockResolvedValue(undefined),
      completar: vi.fn().mockResolvedValue(undefined),
      confirmarPago: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [OrdenesComponent],
      providers: [
        provideRouter([]),
        { provide: OrdenesService, useValue: ordenesFalso },
        { provide: SesionService, useValue: { esSupervisor: signal(true), puedeGestionar: () => true, puedeAvanzarEtapa: () => true } },
      ],
    });
  });

  it('al crearse, carga las órdenes', () => {
    TestBed.createComponent(OrdenesComponent);
    expect(ordenesFalso.cargar).toHaveBeenCalledTimes(1);
  });

  it('ordenesFiltradas() aplica el filtro de estado y búsqueda combinados', () => {
    const fixture = TestBed.createComponent(OrdenesComponent);
    const componente = fixture.componentInstance;
    componente.filtroEstado.set('pendiente');
    componente.busqueda.set('juan');
    expect(componente.ordenesFiltradas()).toEqual([ordenBase()]);
    componente.busqueda.set('nadie');
    expect(componente.ordenesFiltradas()).toEqual([]);
  });

  it('limpiarFiltroFecha() vacía desde/hasta', () => {
    const fixture = TestBed.createComponent(OrdenesComponent);
    const componente = fixture.componentInstance;
    componente.desde.set('2026-01-01');
    componente.hasta.set('2026-01-31');
    componente.limpiarFiltroFecha();
    expect(componente.desde()).toBe('');
    expect(componente.hasta()).toBe('');
    expect(componente.hayFiltroFecha()).toBe(false);
  });

  describe('cambiarEstado()', () => {
    it('si el estado no cambia, no llama al servicio', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      await fixture.componentInstance.cambiarEstado(ordenBase({ estado: 'pendiente' }), 'pendiente');
      expect(ordenesFalso.cambiarEstado).not.toHaveBeenCalled();
    });

    it('a "entregada" sin estar pagada por completo, avisa y no llama al servicio', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        estado: 'finalizada',
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 50, saldo_pendiente: 50, metodo_pago_adelanto: 'efectivo', pagado_totalmente: false },
      });

      await fixture.componentInstance.cambiarEstado(orden, 'entregada');

      expect(ordenesFalso.cambiarEstado).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('no está pagada en su totalidad'));
      alertSpy.mockRestore();
    });

    it('a "entregada" ya pagada, pide confirmación antes de cambiar', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        estado: 'finalizada',
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 100, saldo_pendiente: 0, metodo_pago_adelanto: 'efectivo', pagado_totalmente: true },
      });

      await fixture.componentInstance.cambiarEstado(orden, 'entregada');

      expect(ordenesFalso.cambiarEstado).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('a un estado normal del pipeline, cambia directo sin confirmar', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({ estado: 'pendiente' });

      await fixture.componentInstance.cambiarEstado(orden, 'en_diseno');

      expect(ordenesFalso.cambiarEstado).toHaveBeenCalledWith(orden, 'en_diseno');
    });
  });

  it('asignar(): convierte el id de texto a número, o null si viene vacío', async () => {
    const fixture = TestBed.createComponent(OrdenesComponent);
    const orden = ordenBase();

    await fixture.componentInstance.asignar(orden, '5');
    expect(ordenesFalso.asignar).toHaveBeenCalledWith(orden, 5);

    await fixture.componentInstance.asignar(orden, '');
    expect(ordenesFalso.asignar).toHaveBeenCalledWith(orden, null);
  });

  it('cancelar(): pide confirmación antes de cancelar', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(OrdenesComponent);

    await fixture.componentInstance.cancelar(ordenBase());

    expect(ordenesFalso.cancelar).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });

  describe('reportar uso de materiales (completar)', () => {
    const ordenConMateriales = ordenBase({
      materiales: { estimados: [{ id_material: 1, nombre: 'Lona', cantidad: 10 }] },
    });

    it('abrirCompletar() precarga cantidad_real igual a la estimada', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      fixture.componentInstance.abrirCompletar(ordenConMateriales);
      expect(fixture.componentInstance.materialesComplecion()).toEqual([
        { id_material: 1, nombre: 'Lona', cantidad_estimada: 10, cantidad_real: 10 },
      ]);
    });

    it('sobrantes() detecta materiales usados de menos', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCompletar(ordenConMateriales);
      componente.materialesComplecion.update(lista =>
        lista.map(m => ({ ...m, cantidad_real: 7 })),
      );
      expect(componente.sobrantes()).toEqual([{ nombre: 'Lona', sobrante: 3 }]);
    });

    it('confirmarProduccion(): sin sobrantes, completa directo sin confirmar', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm');
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCompletar(ordenConMateriales);

      await componente.confirmarProduccion();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(ordenesFalso.completar).toHaveBeenCalledWith(1, [{ material_id: 1, cantidad: 10 }]);
      expect(componente.ordenACompletar()).toBeNull();
      confirmSpy.mockRestore();
    });

    it('confirmarProduccion(): con sobrantes, pide confirmar antes de devolver stock', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCompletar(ordenConMateriales);
      componente.materialesComplecion.update(lista => lista.map(m => ({ ...m, cantidad_real: 5 })));

      await componente.confirmarProduccion();

      expect(ordenesFalso.completar).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });
  });

  describe('cobro de saldo', () => {
    it('abrirCobro() precarga el método del adelanto', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 50, saldo_pendiente: 50, metodo_pago_adelanto: 'yape', pagado_totalmente: false },
      });
      fixture.componentInstance.abrirCobro(orden);
      expect(fixture.componentInstance.metodoPago()).toBe('yape');
    });

    it('confirmarPago(): sin orden seleccionada, no hace nada', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      await fixture.componentInstance.confirmarPago();
      expect(ordenesFalso.confirmarPago).not.toHaveBeenCalled();
    });

    it('confirmarPago(): manda método y referencia, y cierra el modal', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCobro(ordenBase());
      componente.referenciaPago.set('  OP-99  ');

      await componente.confirmarPago();

      expect(ordenesFalso.confirmarPago).toHaveBeenCalledWith(1, 'efectivo', 'OP-99');
      expect(componente.ordenACobrar()).toBeNull();
    });
  });
});
