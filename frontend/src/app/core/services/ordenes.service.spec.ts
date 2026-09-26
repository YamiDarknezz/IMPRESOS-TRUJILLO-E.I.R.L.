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
import { hoyISO } from '../../shared/utilidades/fechas';
import { Orden } from '../models';

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
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/ordenes');
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

    await servicio.confirmarPago(1, 'yape', 'OP-123');

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/1/confirmar-pago', {
      metodo_pago: 'yape',
      referencia: 'OP-123',
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

  describe('cambiarEstado() (optimista, revierte si el servidor rechaza)', () => {
    it('actualiza el estado local de inmediato', async () => {
      apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
      const orden = ordenBase({ estado: 'pendiente' });

      await servicio.cambiarEstado(orden, 'en_diseno');

      expect(orden.estado).toBe('en_diseno');
      expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/1/estado', { estado: 'en_diseno' });
    });

    it('si el servidor rechaza, revierte al estado anterior y propaga el error', async () => {
      apiFalsa.post.mockRejectedValue(new Error('Transición no permitida'));
      const orden = ordenBase({ estado: 'pendiente' });

      await expect(servicio.cambiarEstado(orden, 'entregada')).rejects.toThrow('Transición no permitida');
      expect(orden.estado).toBe('pendiente');
    });
  });

  describe('asignar() (optimista, revierte si el servidor rechaza)', () => {
    it('actualiza el asignado local de inmediato', async () => {
      apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
      const orden = ordenBase({ asignado_a: null });

      await servicio.asignar(orden, 5);

      expect(orden.asignado_a).toBe(5);
      expect(apiFalsa.post).toHaveBeenCalledWith('/api/ordenes/1/asignar', { asignado_a: 5 });
    });

    it('si el servidor rechaza, revierte al asignado anterior', async () => {
      apiFalsa.post.mockRejectedValue(new Error('No autorizado'));
      const orden = ordenBase({ asignado_a: 3 });

      await expect(servicio.asignar(orden, 5)).rejects.toThrow('No autorizado');
      expect(orden.asignado_a).toBe(3);
    });
  });

  describe('métricas del panel', () => {
    it('cuenta correctamente en proceso, finalizadas, vencidas y por cobrar', async () => {
      const hoy = hoyISO();
      const datos: Orden[] = [
        ordenBase({ id: 1, estado: 'pendiente', fecha_entrega: '2020-01-01' }), // vencida
        ordenBase({ id: 2, estado: 'en_produccion', fecha_entrega: '2099-01-01' }), // en proceso, no vencida
        ordenBase({ id: 3, estado: 'entregada', fecha_entrega: hoy }), // finalizada
        ordenBase({
          id: 4,
          estado: 'finalizada',
          finanzas: { precio_total: 200, subtotal: 170, igv: 30, adelanto_pago: 0, saldo_pendiente: 80, metodo_pago_adelanto: 'efectivo', pagado_totalmente: false },
        }),
        ordenBase({ id: 5, estado: 'cancelada' }),
      ];
      apiFalsa.get.mockResolvedValue({ status: 'success', data: datos });

      await servicio.cargar();

      expect(servicio.enProceso()).toBe(2); // pendiente (id1) + en_produccion (id2)
      expect(servicio.finalizadas()).toBe(2); // entregada (id3) + finalizada (id4)
      expect(servicio.vencidas()).toBe(1); // solo id1
      expect(servicio.porCobrar()).toBe(80); // solo id4 aporta saldo pendiente
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

    it('combina estado y texto', () => {
      expect(filtrarOrdenes(ordenes, { estado: 'pendiente', texto: 'juan' })).toEqual([ordenes[0]]);
      expect(filtrarOrdenes(ordenes, { estado: 'pendiente', texto: 'maría' })).toEqual([]);
    });
  });
});
