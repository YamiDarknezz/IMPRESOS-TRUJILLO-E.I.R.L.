import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { InventarioService } from '../../core/services/inventario.service';
import { UnidadesService } from '../../core/services/unidades.service';
import { SesionService } from '../../core/services/sesion.service';
import { InventarioComponent } from './inventario';
import { MaterialInventario, PiezaLoteMaterial, Unidad } from '../../core/models';

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
    ganancia_neta: 0,
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
  let unidadesFalso: { unidades: ReturnType<typeof signal<Unidad[]>>; cargar: ReturnType<typeof vi.fn> };

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
    unidadesFalso = { unidades: signal([m2]), cargar: vi.fn().mockResolvedValue(undefined) };
    TestBed.configureTestingModule({
      imports: [InventarioComponent],
      providers: [
        { provide: InventarioService, useValue: inventarioFalso },
        { provide: UnidadesService, useValue: unidadesFalso },
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
});
