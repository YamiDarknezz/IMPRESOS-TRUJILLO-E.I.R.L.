import { computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { InventarioService } from './inventario.service';
import {
  DatosOrden,
  OrdenesService,
  claseEstado,
  estadosDisponibles,
  estaEnPipeline,
  estaVencida,
  filtrarOrdenes,
} from './ordenes.service';
import { Orden } from '../models';

function ordenBase(sobrescribe: Partial<Orden> = {}): Orden {
  return {
    id: 1,
    id_documento: 'C-0001',
    codigo: 'C-0001',
    tipo_documento: 'contrato',
    canal_ingreso: 'otro',
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

describe('OrdenesService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn> };
  let inventarioFalso: { recargar: ReturnType<typeof vi.fn> };
  let servicio: OrdenesService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn().mockResolvedValue({ status: 'success', data: [] }), post: vi.fn(), patch: vi.fn() };
    inventarioFalso = { recargar: vi.fn().mockResolvedValue(undefined) };
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiFalsa },
        { provide: InventarioService, useValue: inventarioFalso },
      ],
    });
    servicio = TestBed.inject(OrdenesService);
  });

  it('crear() postea la orden y recarga órdenes e inventario juntos', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    const datos = { cliente: 'Juan Pérez' } as unknown as DatosOrden;

    await servicio.crear(datos);

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes', datos);
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/ordenes?limit=100&offset=0');
    expect(inventarioFalso.recargar).toHaveBeenCalledTimes(1);
  });

  it('cancelar() postea al endpoint de cancelar', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    await servicio.cancelar(1);
    expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/1/cancelar', {});
  });

  it('completar() manda los materiales reales reportados', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    const materiales = [{ material_id: 1, cantidad: 5 }];

    await servicio.completar(1, materiales);

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/completar', {
      id_orden: 1,
      materiales_reales: materiales,
    });
  });

  it('confirmarPago() manda método y referencia, y recarga solo las órdenes', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });

    await servicio.confirmarPago(1, 'yape', 'OP-123', 'Segundo abono');

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/1/confirmar-pago', {
      metodo_pago: 'yape',
      referencia: 'OP-123',
      descripcion: 'Segundo abono',
    });
    expect(inventarioFalso.recargar).not.toHaveBeenCalled();
  });

  it('crearVentaRapida() postea a caja-rapida y devuelve la orden creada', async () => {
    const creada = ordenBase({ id: 9 });
    apiFalsa.post.mockResolvedValue({ status: 'success', data: creada });

    const resultado = await servicio.crearVentaRapida({ descripcion: 'Venta mostrador', monto_total: 20 });

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/caja-rapida', {
      descripcion: 'Venta mostrador',
      monto_total: 20,
    });
    expect(resultado).toEqual(creada);
  });

  it('crearVentaRapida() refresca también las tarjetas del panel', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: ordenBase({ id: 9 }) });
    apiFalsa.get.mockClear();

    await servicio.crearVentaRapida({ descripcion: 'Venta mostrador', monto_total: 20 });

    expect(apiFalsa.get).toHaveBeenCalledWith('/api/ordenes/metricas');
  });

  describe('cambiarEstado() (optimista, revierte si el servidor rechaza)', () => {
    function conListaCargada(...ordenes: Orden[]): Promise<void> {
      apiFalsa.get.mockResolvedValue({ status: 'success', data: ordenes, total: ordenes.length });
      return servicio.cargar();
    }

    it('actualiza el estado en la lista de inmediato', async () => {
      const orden = ordenBase({ estado: 'pendiente' });
      await conListaCargada(orden);
      apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });

      await servicio.cambiarEstado(orden, 'en_diseno');

      expect(servicio.ordenes()[0].estado).toBe('en_diseno');
      expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/1/estado', { estado: 'en_diseno' });
    });

    // Issue #29: antes se mutaba el objeto dentro del arreglo y el signal no
    // avisaba, así que la lista filtrada seguía mostrando la etapa anterior.
    it('reemplaza la orden por una copia: el filtro por etapa se vuelve a calcular', async () => {
      const orden = ordenBase({ estado: 'en_produccion' });
      await conListaCargada(orden);
      const filtradas = computed(() =>
        filtrarOrdenes(servicio.ordenes(), { estado: 'en_produccion', texto: '', desde: '', hasta: '' })
      );
      expect(filtradas()).toHaveLength(1);
      apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });

      await servicio.cambiarEstado(orden, 'finalizada');

      expect(filtradas()).toHaveLength(0);
      expect(servicio.ordenes()[0]).not.toBe(orden);
      expect(orden.estado).toBe('en_produccion');
    });

    it('tras el cambio vuelve a pedir las métricas del panel', async () => {
      const orden = ordenBase();
      await conListaCargada(orden);
      apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
      apiFalsa.get.mockClear();

      await servicio.cambiarEstado(orden, 'en_diseno');

      expect(apiFalsa.get).toHaveBeenCalledWith('/api/ordenes/metricas');
    });

    it('si el servidor rechaza, revierte al estado anterior y propaga el error', async () => {
      const orden = ordenBase({ estado: 'pendiente' });
      await conListaCargada(orden);
      apiFalsa.post.mockRejectedValue(new Error('Transición no permitida'));

      await expect(servicio.cambiarEstado(orden, 'entregada')).rejects.toThrow('Transición no permitida');
      expect(servicio.ordenes()[0].estado).toBe('pendiente');
    });
  });

  describe('asignar() (optimista, revierte si el servidor rechaza)', () => {
    it('actualiza el asignado en la lista de inmediato', async () => {
      const orden = ordenBase({ asignado_a: null });
      apiFalsa.get.mockResolvedValue({ status: 'success', data: [orden], total: 1 });
      await servicio.cargar();
      apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });

      await servicio.asignar(orden, 5);

      expect(servicio.ordenes()[0].asignado_a).toBe(5);
      expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/1/asignar', { asignado_a: 5 });
    });

    it('si el servidor rechaza, revierte al asignado anterior', async () => {
      const orden = ordenBase({ asignado_a: 3 });
      apiFalsa.get.mockResolvedValue({ status: 'success', data: [orden], total: 1 });
      await servicio.cargar();
      apiFalsa.post.mockRejectedValue(new Error('No autorizado'));

      await expect(servicio.asignar(orden, 5)).rejects.toThrow('No autorizado');
      expect(servicio.ordenes()[0].asignado_a).toBe(3);
    });
  });

  describe('métricas del panel (las suma el backend)', () => {
    const metricas = {
      total: 120,
      en_proceso: 7,
      finalizadas: 5,
      vencidas: 2,
      por_cobrar: 310.5,
    };

    it('cargarMetricas() las pide al endpoint y las expone', async () => {
      apiFalsa.get.mockRejectedValue(new Error('no debería pedir la lista aquí'));
      apiFalsa.get.mockResolvedValue({ status: 'success', data: metricas });

      await servicio.cargarMetricas();

      expect(apiFalsa.get).toHaveBeenCalledWith('/api/ordenes/metricas');
      expect(servicio.enProceso()).toBe(7);
      expect(servicio.finalizadas()).toBe(5);
      expect(servicio.vencidas()).toBe(2);
      expect(servicio.porCobrar()).toBe(310.5);
    });

    it('sin datos del servidor muestra ceros, no números calculados en el navegador', () => {
      expect(servicio.enProceso()).toBe(0);
      expect(servicio.finalizadas()).toBe(0);
      expect(servicio.vencidas()).toBe(0);
      expect(servicio.porCobrar()).toBe(0);
    });

    it('si la petición falla, conserva lo último que se supo', async () => {
      apiFalsa.get.mockResolvedValueOnce({ status: 'success', data: metricas });
      await servicio.cargarMetricas();

      apiFalsa.get.mockRejectedValueOnce(new Error('sin red'));
      await servicio.cargarMetricas();

      expect(servicio.enProceso()).toBe(7);
      expect(servicio.porCobrar()).toBe(310.5);
    });
  });

  describe('paginación del listado', () => {
    it('cargar() pide el primer bloque e informa cuántas hay en total', async () => {
      apiFalsa.get.mockResolvedValue({ status: 'success', data: [ordenBase()], total: 120 });

      await servicio.cargar();

      expect(apiFalsa.get).toHaveBeenCalledWith('/api/ordenes?limit=100&offset=0');
      expect(servicio.totalOrdenes()).toBe(120);
      expect(servicio.hayMasOrdenes()).toBe(true);
    });

    it('cargarMasOrdenes() trae el bloque siguiente y lo agrega al final', async () => {
      apiFalsa.get.mockResolvedValue({ status: 'success', data: [ordenBase({ id: 1 })], total: 2 });
      await servicio.cargar();

      apiFalsa.get.mockResolvedValue({ status: 'success', data: [ordenBase({ id: 2 })], total: 2 });
      await servicio.cargarMasOrdenes();

      expect(apiFalsa.get).toHaveBeenLastCalledWith('/api/ordenes?limit=100&offset=1');
      expect(servicio.ordenes().map(o => o.id)).toEqual([1, 2]);
      expect(servicio.hayMasOrdenes()).toBe(false);
    });

    it('si no hay más, no vuelve a pedir', async () => {
      apiFalsa.get.mockResolvedValue({ status: 'success', data: [ordenBase()], total: 1 });
      await servicio.cargar();
      apiFalsa.get.mockClear();

      await servicio.cargarMasOrdenes();

      expect(apiFalsa.get).not.toHaveBeenCalled();
    });
  });
});

describe('funciones puras de órdenes', () => {
  it('estaEnPipeline(): true solo para las etapas en curso', () => {
    expect(estaEnPipeline(ordenBase({ estado: 'en_produccion' }))).toBe(true);
    expect(estaEnPipeline(ordenBase({ estado: 'entregada' }))).toBe(false);
    expect(estaEnPipeline(ordenBase({ estado: 'cancelada' }))).toBe(false);
  });

  it('estaVencida(): en pipeline y con fecha de entrega pasada', () => {
    expect(estaVencida(ordenBase({ estado: 'pendiente', fecha_entrega: '2000-01-01' }))).toBe(true);
    expect(estaVencida(ordenBase({ estado: 'pendiente', fecha_entrega: '2099-01-01' }))).toBe(false);
    // Aunque esté vencida en fecha, si ya no está en pipeline no cuenta como vencida.
    expect(estaVencida(ordenBase({ estado: 'entregada', fecha_entrega: '2000-01-01' }))).toBe(false);
  });

  it('estadosDisponibles(): en pipeline puede ir a cualquier etapa del pipeline', () => {
    expect(estadosDisponibles(ordenBase({ estado: 'pendiente' }))).toEqual([
      'pendiente', 'en_diseno', 'aprobado', 'en_produccion',
    ]);
  });

  it('estadosDisponibles(): finalizada solo puede pasar a entregada', () => {
    expect(estadosDisponibles(ordenBase({ estado: 'finalizada' }))).toEqual(['finalizada', 'entregada']);
  });

  it('estadosDisponibles(): entregada o cancelada no tienen más movimientos', () => {
    expect(estadosDisponibles(ordenBase({ estado: 'entregada' }))).toEqual([]);
    expect(estadosDisponibles(ordenBase({ estado: 'cancelada' }))).toEqual([]);
  });

  it('claseEstado(): arma la clase CSS reemplazando el guion bajo', () => {
    expect(claseEstado('en_diseno')).toBe('badge-estado-en-diseno');
    expect(claseEstado('pendiente')).toBe('badge-estado-pendiente');
  });

  describe('filtrarOrdenes()', () => {
    // Issue #69
    it('filtra por canal de ingreso, y sin canal no filtra', () => {
      const ordenes = [
        ordenBase({ id: 1, canal_ingreso: 'whatsapp' }),
        ordenBase({ id: 2, canal_ingreso: 'llamada' }),
      ];
      expect(filtrarOrdenes(ordenes, { canal: 'whatsapp' }).map(o => o.id)).toEqual([1]);
      expect(filtrarOrdenes(ordenes, { canal: '' }).map(o => o.id)).toEqual([1, 2]);
    });

    const ordenes: Orden[] = [
      ordenBase({ id: 1, estado: 'pendiente', cliente: 'Juan Pérez', id_documento: 'C-0001', fecha_creacion: '2026-09-01' }),
      ordenBase({ id: 2, estado: 'entregada', cliente: 'María López', id_documento: 'C-0002', fecha_creacion: '2026-09-15' }),
      ordenBase({ id: 3, estado: 'cancelada', cliente: 'Pedro Ruiz', id_documento: 'C-0003', fecha_creacion: '2026-09-20' }),
    ];

    it('sin opciones, devuelve todo', () => {
      expect(filtrarOrdenes(ordenes, {})).toEqual(ordenes);
    });

    it('filtra por estado exacto', () => {
      expect(filtrarOrdenes(ordenes, { estado: 'entregada' })).toEqual([ordenes[1]]);
    });

    it('"todos" no filtra por estado', () => {
      expect(filtrarOrdenes(ordenes, { estado: 'todos' })).toEqual(ordenes);
    });

    it('filtra por texto libre (código o cliente)', () => {
      expect(filtrarOrdenes(ordenes, { texto: 'maría' })).toEqual([ordenes[1]]);
      expect(filtrarOrdenes(ordenes, { texto: 'C-0003' })).toEqual([ordenes[2]]);
    });

    it('filtra por rango de fechas de creación', () => {
      expect(filtrarOrdenes(ordenes, { desde: '2026-09-10', hasta: '2026-09-16' })).toEqual([ordenes[1]]);
    });

    // #26: una orden creada a las 23:32 hora de Perú es de ese día, aunque en
    // UTC ya sea el siguiente (04:32). Antes el filtro la ubicaba al día
    // siguiente y desaparecía del rango que el usuario eligió.
    it('ubica la orden creada de noche en el día peruano', () => {
      const deNoche = ordenBase({
        id: 9,
        estado: 'pendiente',
        id_documento: 'C-0009',
        fecha_creacion: '2026-09-26T04:32:16+00:00',
      });

      expect(filtrarOrdenes([deNoche], { desde: '2026-09-25', hasta: '2026-09-25' })).toEqual([deNoche]);
      expect(filtrarOrdenes([deNoche], { desde: '2026-09-26', hasta: '2026-09-26' })).toEqual([]);
    });

    it('combina estado y texto', () => {
      expect(filtrarOrdenes(ordenes, { estado: 'pendiente', texto: 'juan' })).toEqual([ordenes[0]]);
      expect(filtrarOrdenes(ordenes, { estado: 'pendiente', texto: 'maría' })).toEqual([]);
    });
  });
});
