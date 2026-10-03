import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { InventarioService } from '../../core/services/inventario.service';
import { UnidadesService } from '../../core/services/unidades.service';
import { SesionService } from '../../core/services/sesion.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { InventarioComponent } from './inventario';
import { MaterialInventario, Orden, PiezaLoteMaterial, Unidad } from '../../core/models';

const m2: Unidad = { id: 6, nombre: 'Metro cuadrado', abreviatura: 'm2', activo: true };

const lona: MaterialInventario = {
  id: 1,
  nombre: 'Lona banner 13 oz',
  unidad_id: 6,
  unidad: 'm2',
  stock_actual: 100,
  alerta_minima: 30,
  tipo_formato: 'continuo_rollo',
  precio_compra: 5,
  ubicacion_estante: 'A-1',
};

function piezaBase(sobrescribe: Partial<PiezaLoteMaterial> = {}): PiezaLoteMaterial {
  return {
    id: 1,
    material_id: 1,
    codigo_identificador: 'ROLL-01',
    capacidad_inicial: 100,
    saldo_restante: 50,
    unidad_medida: 'm',
    costo_adquisicion: 5,
    estado: 'disponible',
    ubicacion: 'A-1',
    maquina_asignada: '',
    fecha_ingreso: '2026-09-01',
    nota: '',
    total_recaudado: 0,
    ...sobrescribe,
  };
}

describe('InventarioComponent', () => {
  let inventarioFalso: {
    materiales: ReturnType<typeof signal<MaterialInventario[]>>;
    cargar: ReturnType<typeof vi.fn>;
    crear: ReturnType<typeof vi.fn>;
    actualizar: ReturnType<typeof vi.fn>;
    listarMovimientos: ReturnType<typeof vi.fn>;
    listarPiezas: ReturnType<typeof vi.fn>;
    obtenerPieza: ReturnType<typeof vi.fn>;
    registrarPieza: ReturnType<typeof vi.fn>;
    registrarConsumoPieza: ReturnType<typeof vi.fn>;
  };
  let ordenesFalso: { ordenes: ReturnType<typeof signal<Orden[]>>; cargar: ReturnType<typeof vi.fn> };
  let unidadesFalso: {
    unidades: ReturnType<typeof signal<Unidad[]>>;
    todas: ReturnType<typeof signal<Unidad[]>>;
    cargar: ReturnType<typeof vi.fn>;
    cargarTodas: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    inventarioFalso = {
      materiales: signal([lona]),
      cargar: vi.fn().mockResolvedValue(undefined),
      crear: vi.fn().mockResolvedValue(undefined),
      actualizar: vi.fn().mockResolvedValue(undefined),
      listarMovimientos: vi.fn().mockResolvedValue([]),
      listarPiezas: vi.fn().mockResolvedValue([piezaBase()]),
      obtenerPieza: vi.fn().mockResolvedValue(piezaBase()),
      registrarPieza: vi.fn().mockResolvedValue(piezaBase()),
      registrarConsumoPieza: vi.fn().mockResolvedValue({}),
    };
    ordenesFalso = { ordenes: signal<Orden[]>([]), cargar: vi.fn().mockResolvedValue(undefined) };
    unidadesFalso = {
      unidades: signal([m2]),
      // El catálogo completo (con las desactivadas) lo usa la edición de un
      // material cuya unidad ya no está activa (#58).
      todas: signal([m2]),
      cargar: vi.fn().mockResolvedValue(undefined),
      cargarTodas: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [InventarioComponent],
      providers: [
        { provide: InventarioService, useValue: inventarioFalso },
        { provide: UnidadesService, useValue: unidadesFalso },
        { provide: OrdenesService, useValue: ordenesFalso },
        { provide: SesionService, useValue: { esSupervisor: signal(true) } },
      ],
    });
  });

  it('al crearse, carga materiales, unidades y piezas', () => {
    TestBed.createComponent(InventarioComponent);
    expect(inventarioFalso.cargar).toHaveBeenCalledTimes(1);
    expect(unidadesFalso.cargar).toHaveBeenCalledTimes(1);
    expect(inventarioFalso.listarPiezas).toHaveBeenCalledTimes(1);
  });

  it('materialesFiltrados() respeta la búsqueda', () => {
    const fixture = TestBed.createComponent(InventarioComponent);
    const componente = fixture.componentInstance;
    componente.busqueda.set('lona');
    expect(componente.materialesFiltrados()).toEqual([lona]);
    componente.busqueda.set('no existe');
    expect(componente.materialesFiltrados()).toEqual([]);
  });

  it('cambiarPestana(): al ir a "piezas", vuelve a cargarlas', () => {
    const fixture = TestBed.createComponent(InventarioComponent);
    inventarioFalso.listarPiezas.mockClear();
    fixture.componentInstance.cambiarPestana('piezas');
    expect(fixture.componentInstance.pestanaActiva()).toBe('piezas');
    expect(inventarioFalso.listarPiezas).toHaveBeenCalledTimes(1);
  });

  describe('alta de material', () => {
    it('guardar(): exige nombre y unidad antes de confirmar', async () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      await fixture.componentInstance.guardar();
      expect(fixture.componentInstance.errores()).toEqual({
        nombre: 'El nombre es requerido.',
        unidadId: 'La unidad es requerida.',
      });
      expect(inventarioFalso.crear).not.toHaveBeenCalled();
    });

    it('guardar(): si el usuario cancela la confirmación, no crea nada', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('nombre', 'Vinil adhesivo');
      componente.actualizar('unidadId', 6);

      await componente.guardar();

      expect(inventarioFalso.crear).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('guardar(): confirmado, crea el material con todos los campos', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('nombre', 'Vinil adhesivo');
      componente.actualizar('unidadId', 6);
      componente.actualizar('stockInicial', 20);

      await componente.guardar();

      expect(inventarioFalso.crear).toHaveBeenCalledWith(
        expect.objectContaining({ nombre: 'Vinil adhesivo', unidad_id: 6, stock_inicial: 20 }),
      );
      confirmSpy.mockRestore();
    });
  });

  describe('edición de material', () => {
    it('abrirEdicion() precarga el formulario con los datos del material', () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      fixture.componentInstance.abrirEdicion(lona);
      expect(fixture.componentInstance.formEdicion()).toEqual(
        expect.objectContaining({ nombre: 'Lona banner 13 oz', unidadId: 6, stockActual: 100 }),
      );
    });

    it('guardarEdicion(): sin material en edición, no hace nada', async () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      await fixture.componentInstance.guardarEdicion();
      expect(inventarioFalso.actualizar).not.toHaveBeenCalled();
    });

    it('guardarEdicion(): manda ficha y stock actual al servicio', async () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.abrirEdicion(lona);

      await componente.guardarEdicion();

      expect(inventarioFalso.actualizar).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ nombre: 'Lona banner 13 oz' }),
        100,
        100,
      );
      expect(componente.editando()).toBeNull();
    });
  });

  it('verMovimientos() trae la trazabilidad del material', async () => {
    const fixture = TestBed.createComponent(InventarioComponent);
    await fixture.componentInstance.verMovimientos(lona);
    expect(inventarioFalso.listarMovimientos).toHaveBeenCalledWith(1);
    expect(fixture.componentInstance.materialMovimientos()).toEqual(lona);

    fixture.componentInstance.cerrarMovimientos();
    expect(fixture.componentInstance.materialMovimientos()).toBeNull();
  });

  describe('rollos y planchas', () => {
    it('abrirNuevaPieza() precarga desde el primer material disponible', () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      fixture.componentInstance.abrirNuevaPieza();
      expect(fixture.componentInstance.formPieza()).toEqual(
        expect.objectContaining({ material_id: 1, capacidad_inicial: 100, unidad_medida: 'm2' }),
      );
      expect(fixture.componentInstance.modalNuevaPieza()).toBe(true);
    });

    it('alCambiarMaterialPieza() actualiza los valores por defecto según el material elegido', () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      fixture.componentInstance.alCambiarMaterialPieza(1);
      expect(fixture.componentInstance.formPieza().ubicacion).toBe('A-1');
      expect(fixture.componentInstance.formPieza().costo_adquisicion).toBe(5);
    });

    it('guardarNuevaPieza(): exige material, código y capacidad válida', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.actualizarPieza('material_id', 0);

      await componente.guardarNuevaPieza();

      expect(inventarioFalso.registrarPieza).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Selecciona un material.');
      alertSpy.mockRestore();
    });

    it('guardarNuevaPieza(): con datos válidos, registra y recarga las piezas', async () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.abrirNuevaPieza();
      componente.actualizarPieza('codigo_identificador', 'ROLL-02');

      await componente.guardarNuevaPieza();

      expect(inventarioFalso.registrarPieza).toHaveBeenCalledWith(
        expect.objectContaining({ codigo_identificador: 'ROLL-02' }),
      );
      expect(componente.modalNuevaPieza()).toBe(false);
    });

    it('guardarConsumo(): exige descripción del trabajo', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.abrirConsumo(piezaBase());

      await componente.guardarConsumo();

      expect(inventarioFalso.registrarConsumoPieza).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Ingresa la descripción del trabajo.');
      alertSpy.mockRestore();
    });

    it('guardarConsumo(): si hay monto, exige método de pago', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.abrirConsumo(piezaBase());
      componente.actualizarConsumo('trabajo_descripcion', 'Corte de banner');
      componente.actualizarConsumo('cantidad_consumida', 1);
      componente.actualizarConsumo('monto_cobrado', 45);

      await componente.guardarConsumo();

      expect(inventarioFalso.registrarConsumoPieza).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Selecciona el método de pago del cobro.');
      alertSpy.mockRestore();
    });

    it('guardarConsumo(): no deja consumir más del saldo restante', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      componente.abrirConsumo(piezaBase({ saldo_restante: 5 }));
      componente.actualizarConsumo('trabajo_descripcion', 'Corte de banner');
      componente.actualizarConsumo('cantidad_consumida', 10);

      await componente.guardarConsumo();

      expect(inventarioFalso.registrarConsumoPieza).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('La cantidad solicitada supera el saldo disponible (5 m).');
      alertSpy.mockRestore();
    });

    it('guardarConsumo(): con datos válidos, registra el consumo y recarga', async () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;
      const pieza = piezaBase({ saldo_restante: 50 });
      componente.abrirConsumo(pieza);
      componente.actualizarConsumo('trabajo_descripcion', 'Corte de banner');
      componente.actualizarConsumo('cantidad_consumida', 10);

      await componente.guardarConsumo();

      expect(inventarioFalso.registrarConsumoPieza).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ trabajo_descripcion: 'Corte de banner', cantidad_consumida: 10 }),
      );
      expect(componente.modalConsumo()).toBe(false);
    });

    it('verDetallePieza() / cerrarDetallePieza() abren y cierran el detalle', async () => {
      const fixture = TestBed.createComponent(InventarioComponent);
      const componente = fixture.componentInstance;

      await componente.verDetallePieza(piezaBase());
      expect(componente.piezaDetalle()).toEqual(piezaBase());

      componente.cerrarDetallePieza();
      expect(componente.piezaDetalle()).toBeNull();
    });
  });

  // Issue #38: los cinco modales son diálogos accesibles que se cierran con Escape.
  describe('modales (#38)', () => {
    function abrir(abre: (c: InventarioComponent) => void, cerrado: (c: InventarioComponent) => unknown) {
      const fixture = TestBed.createComponent(InventarioComponent);
      abre(fixture.componentInstance);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();

      expect(cerrado(fixture.componentInstance)).toBeFalsy();
    }

    it('editar material: Escape lo cierra', () =>
      abrir(c => c.abrirEdicion(lona), c => c.editando()));

    it('movimientos de un material: Escape lo cierra', () =>
      abrir(c => c.materialMovimientos.set(lona), c => c.materialMovimientos()));

    it('alta de rollo o plancha: Escape lo cierra', () =>
      abrir(c => c.abrirNuevaPieza(), c => c.modalNuevaPieza()));

    it('registrar consumo: Escape lo cierra', () =>
      abrir(c => c.abrirConsumo(piezaBase()), c => c.modalConsumo()));

    it('historial de cortes de una pieza: Escape lo cierra', () =>
      abrir(c => c.piezaDetalle.set(piezaBase({ consumos: [] })), c => c.piezaDetalle()));
  });

  // Issue #71: los cortes se asignan a un pedido y avisan si el saldo no alcanza.
  describe('corte asignado a un pedido (#71)', () => {
    function pedido(sobrescribe: Partial<Orden> = {}): Orden {
      return {
        id: 7, id_documento: 'ORD-000007', codigo: 'ORD-000007', tipo_documento: 'contrato',
        canal_ingreso: 'otro', unidad_negocio: 'imprenta', cliente_id: 1, cliente: 'Juan', direccion: '',
        telefono: '', descripcion: 'Banner del evento', estado: 'en_produccion', fecha_creacion: '2026-09-01',
        fecha_entrega: '2026-12-31', creado_por: 1, asignado_a: null, asignado: '', incluye_igv: false,
        subtotal: 100, igv: 0, items: [],
        materiales: { estimados: [{ id_material: 1, nombre: 'Lona banner 13 oz', cantidad: 6, unidad: 'm' }] },
        ...sobrescribe,
      };
    }

    function abierto() {
      const componente = TestBed.createComponent(InventarioComponent).componentInstance;
      componente.abrirConsumo(piezaBase({ saldo_restante: 4, unidad_medida: 'm' }));
      return componente;
    }

    it('al crearse, carga también los pedidos', () => {
      TestBed.createComponent(InventarioComponent);
      expect(ordenesFalso.cargar).toHaveBeenCalledTimes(1);
    });

    it('solo ofrece pedidos en curso', () => {
      ordenesFalso.ordenes.set([pedido(), pedido({ id: 8, estado: 'entregada' }), pedido({ id: 9, estado: 'cancelada' })]);
      const componente = TestBed.createComponent(InventarioComponent).componentInstance;
      expect(componente.ordenesEnCurso().map(o => o.id)).toEqual([7]);
    });

    it('elegir el pedido llena la descripción del trabajo solo si estaba vacía', () => {
      ordenesFalso.ordenes.set([pedido()]);
      const componente = abierto();

      componente.elegirOrdenDelCorte('7');
      expect(componente.formConsumo().orden_id).toBe(7);
      expect(componente.formConsumo().trabajo_descripcion).toBe('Banner del evento');

      componente.actualizarConsumo('trabajo_descripcion', 'Mi propio texto');
      componente.elegirOrdenDelCorte('7');
      expect(componente.formConsumo().trabajo_descripcion).toBe('Mi propio texto');

      componente.elegirOrdenDelCorte('');
      expect(componente.formConsumo().orden_id).toBeNull();
    });

    it('avisa cuando el saldo del rollo no alcanza para lo que reservó el pedido', () => {
      ordenesFalso.ordenes.set([pedido()]); // reservó 6 m y al rollo le quedan 4 m
      const componente = abierto();
      componente.elegirOrdenDelCorte('7');

      expect(componente.avisoDeSaldo()?.tipo).toBe('alerta');
      expect(componente.avisoDeSaldo()?.texto).toContain('no alcanza');
    });

    it('si el saldo alcanza, solo informa', () => {
      ordenesFalso.ordenes.set([pedido({ materiales: { estimados: [{ id_material: 1, nombre: 'Lona', cantidad: 3, unidad: 'm' }] } })]);
      const componente = abierto();
      componente.elegirOrdenDelCorte('7');
      expect(componente.avisoDeSaldo()?.tipo).toBe('info');
    });

    it('con unidades distintas no compara: informa y pide revisar a mano', () => {
      ordenesFalso.ordenes.set([pedido({ materiales: { estimados: [{ id_material: 1, nombre: 'Lona', cantidad: 6, unidad: 'm2' }] } })]);
      const componente = abierto();
      componente.elegirOrdenDelCorte('7');
      expect(componente.avisoDeSaldo()?.tipo).toBe('info');
      expect(componente.avisoDeSaldo()?.texto).toContain('unidades distintas');
    });

    it('si el pedido no reservó este material, lo dice', () => {
      ordenesFalso.ordenes.set([pedido({ materiales: { estimados: [] } })]);
      const componente = abierto();
      componente.elegirOrdenDelCorte('7');
      expect(componente.avisoDeSaldo()?.texto).toContain('no reservó');
    });

    it('sin pedido elegido no hay aviso', () => {
      expect(abierto().avisoDeSaldo()).toBeNull();
    });

    it('guardarConsumo() manda el pedido elegido', async () => {
      ordenesFalso.ordenes.set([pedido()]);
      const componente = abierto();
      componente.elegirOrdenDelCorte('7');
      componente.actualizarConsumo('cantidad_consumida', 2);

      await componente.guardarConsumo();

      expect(inventarioFalso.registrarConsumoPieza).toHaveBeenCalledWith(
        1, expect.objectContaining({ orden_id: 7, cantidad_consumida: 2 })
      );
    });

    it('proyecta cuántos cortes más le quedan al rollo al ritmo de los anteriores', () => {
      const componente = TestBed.createComponent(InventarioComponent).componentInstance;
      componente.piezaDetalle.set(piezaBase({
        saldo_restante: 10,
        consumos: [
          { id: 1, pieza_id: 1, trabajo_descripcion: 'a', cantidad_consumida: 2, saldo_anterior: 20, saldo_nuevo: 18, monto_cobrado: 0, merma_desperdicio: 0, fecha: '2026-09-01', nota: '' },
          { id: 2, pieza_id: 1, trabajo_descripcion: 'b', cantidad_consumida: 3, saldo_anterior: 18, saldo_nuevo: 15, monto_cobrado: 0, merma_desperdicio: 0, fecha: '2026-09-02', nota: '' },
        ],
      }));
      expect(componente.proyeccionPieza()).toEqual({ promedio: 2.5, cortesRestantes: 4 });
    });

    it('sin cortes o sin saldo no hay proyección', () => {
      const componente = TestBed.createComponent(InventarioComponent).componentInstance;
      componente.piezaDetalle.set(piezaBase({ consumos: [] }));
      expect(componente.proyeccionPieza()).toBeNull();
    });
  });

  // Issue #109: la ubicación se ve y se puede filtrar.
  describe('ubicación (#109)', () => {
    const enAlmacen: MaterialInventario = { ...lona, id: 2, nombre: 'Vinilo', ubicacion_estante: 'Almacén' };

    it('materialesFiltrados() respeta el filtro de ubicación', () => {
      inventarioFalso.materiales.set([lona, enAlmacen]);
      const componente = TestBed.createComponent(InventarioComponent).componentInstance;
      expect(componente.ubicaciones()).toEqual(['A-1', 'Almacén']);

      componente.filtroUbicacion.set('Almacén');
      expect(componente.materialesFiltrados()).toEqual([enAlmacen]);

      componente.filtroUbicacion.set('');
      expect(componente.materialesFiltrados()).toEqual([lona, enAlmacen]);
    });

    it('piezasFiltradas() busca también por ubicación', async () => {
      inventarioFalso.listarPiezas.mockResolvedValue([
        piezaBase({ id: 1, ubicacion: 'Estante 2' }),
        piezaBase({ id: 2, codigo_identificador: 'PL-02', ubicacion: 'Almacén' }),
      ]);
      const componente = TestBed.createComponent(InventarioComponent).componentInstance;
      await componente.cargarPiezas();

      componente.busquedaPiezas.set('almacén');

      expect(componente.piezasFiltradas().map(p => p.id)).toEqual([2]);
    });
  });
});
