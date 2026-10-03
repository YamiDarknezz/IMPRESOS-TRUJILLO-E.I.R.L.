import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { InventarioService } from './inventario.service';
import {
  CanalIngreso,
  ESTADOS_CERRADOS,
  ESTADOS_PIPELINE,
  EstadoOrden,
  MaterialItem,
  MetodoPago,
  MetricasOrdenes,
  Orden,
  RespuestaItem,
  TipoDocumento,
  UnidadNegocio,
  VentaRapidaData,
} from '../models';
import { ListaRemota } from './lista-remota';
import { aFechaISO, hoyISO } from '../../shared/utilidades/fechas';

/** Línea del contrato, con medidas para gran formato. */
export interface ItemOrdenData {
  descripcion: string;
  producto_id?: number | null;
  ancho_m?: number | null;
  alto_m?: number | null;
  cantidad: number;
  precio_unitario: number;
}

export interface MaterialEstimadoData {
  material_id: number;
  cantidad: number;
}

/** Datos que el formulario envía al crear o editar una orden. */
export interface DatosOrden {
  cliente_id: number | null;
  cliente: string;
  direccion: string;
  telefono: string;
  asignado_a: number | null;
  descripcion: string;
  tipo_documento: TipoDocumento;
  canal_ingreso: CanalIngreso;
  unidad_negocio: UnidadNegocio;
  fecha_entrega: string;
  incluye_igv: boolean;
  items: ItemOrdenData[];
  materiales_estimados: MaterialEstimadoData[];
  descuento: number;
  motivo_descuento: string;
  /** Subtotal directo cuando la orden no se detalla por líneas. */
  precio_total: number | null;
  adelanto_pago: number;
  metodo_pago: MetodoPago;
  /** Para qué es el adelanto (#110). */
  adelanto_descripcion: string;
}

@Injectable({ providedIn: 'root' })
export class OrdenesService {
  private api = inject(ApiService);
  private inventario = inject(InventarioService);

  /** Se pide por bloques de 100 y el backend informa cuántas hay en total. */
  private lista = new ListaRemota<Orden>(this.api, '/api/ordenes', 100);

  readonly ordenes = this.lista.items;
  readonly cargando = this.lista.cargando;
  readonly totalOrdenes = this.lista.total;
  readonly hayMasOrdenes = this.lista.hayMas;
  readonly cargandoMasOrdenes = this.lista.cargandoMas;

  cargar = (forzar = false) => this.lista.cargar(forzar);
  recargar = () => this.lista.recargar();
  cargarMasOrdenes = () => this.lista.cargarMas();

  /**
   * Recarga órdenes e inventario a la vez: toda operación sobre una orden
   * mueve stock, así que mostrar una sin la otra deja la pantalla inconsistente.
   */
  private async recargarConInventario(): Promise<void> {
    await Promise.all([this.lista.recargar(), this.inventario.recargar(), this.cargarMetricas()]);
  }

  // ── Métricas del panel ───────────────────────────────────────────────────
  // Las suma el backend sobre TODAS las órdenes (#27). Antes se calculaban
  // aquí sobre la lista cargada, que viene recortada a 100: a partir de la
  // orden 101 el panel mostraba números falsos sin avisar, y las órdenes
  // antiguas ni siquiera eran alcanzables.

  readonly metricas = signal<MetricasOrdenes | null>(null);

  readonly enProceso = computed(() => this.metricas()?.en_proceso ?? 0);
  readonly finalizadas = computed(() => this.metricas()?.finalizadas ?? 0);
  readonly vencidas = computed(() => this.metricas()?.vencidas ?? 0);
  readonly porCobrar = computed(() => this.metricas()?.por_cobrar ?? 0);

  /** Pide los indicadores del panel. Se llama al cargar y tras cada operación. */
  async cargarMetricas(): Promise<void> {
    try {
      const res = await this.api.get<RespuestaItem<MetricasOrdenes>>('/api/ordenes/metricas');
      this.metricas.set(res.data);
    } catch {
      // Se conserva lo último que se supo: es preferible a mostrar ceros.
    }
  }

  // ── Operaciones ──────────────────────────────────────────────────────────

  /** Crea la orden y devuelve la creada: el formulario la necesita para adjuntar. */
  async crear(datos: DatosOrden): Promise<Orden> {
    const res = await this.api.post<RespuestaItem<Orden>>('/api/ordenes', datos);
    await this.recargarConInventario();
    return res.data;
  }

  async actualizar(idOrden: number, datos: DatosOrden): Promise<void> {
    await this.api.patch(`/api/ordenes/${idOrden}`, datos);
    await this.recargarConInventario();
  }

  async cancelar(idOrden: number): Promise<void> {
    await this.api.post(`/api/ordenes/${idOrden}/cancelar`, {});
    await this.recargarConInventario();
  }

  async completar(idOrden: number, materialesReales: MaterialEstimadoData[]): Promise<void> {
    await this.api.post(`/api/ordenes/completar`, {
      id_orden: idOrden,
      materiales_reales: materialesReales,
    });
    await this.recargarConInventario();
  }

  /** Registra el cobro y devuelve la orden: de ahí sale el pago al que se adjunta. */
  async confirmarPago(
    idOrden: number,
    metodo: MetodoPago,
    referencia = '',
    descripcion = ''
  ): Promise<Orden> {
    const res = await this.api.post<RespuestaItem<Orden>>(
      `/api/ordenes/${idOrden}/confirmar-pago`,
      { metodo_pago: metodo, referencia, descripcion }
    );
    await this.lista.recargar();
    return res.data;
  }

  async crearVentaRapida(data: VentaRapidaData): Promise<Orden> {
    const res = await this.api.post<RespuestaItem<Orden>>('/api/ordenes/caja-rapida', data);
    await Promise.all([this.lista.recargar(), this.cargarMetricas()]);
    return res.data;
  }

  /**
   * Reemplaza la orden por una copia con los cambios. Mutar el objeto dentro
   * del arreglo no avisa al signal: la lista filtrada (un `computed`) seguía
   * mostrando la orden bajo el filtro anterior (#29).
   */
  private parchear(idOrden: number, cambios: Partial<Orden>): void {
    this.lista.items.update(lista =>
      lista.map(o => (o.id === idOrden ? { ...o, ...cambios } : o))
    );
  }

  /**
   * Cambia la etapa mostrando el resultado de inmediato y revirtiendo si el
   * servidor lo rechaza. Mueve solo un campo, así que no hace falta recargar
   * toda la lista; sí las métricas, que cuentan órdenes por etapa.
   */
  async cambiarEstado(orden: Orden, estado: EstadoOrden): Promise<void> {
    const anterior = orden.estado;
    this.parchear(orden.id, { estado });
    try {
      await this.api.post(`/api/ordenes/${orden.id}/estado`, { estado });
    } catch (error) {
      this.parchear(orden.id, { estado: anterior });
      throw error;
    }
    void this.cargarMetricas();
  }

  async asignar(orden: Orden, idUsuario: number | null): Promise<void> {
    const anterior = orden.asignado_a;
    this.parchear(orden.id, { asignado_a: idUsuario });
    try {
      await this.api.post(`/api/ordenes/${orden.id}/asignar`, { asignado_a: idUsuario });
    } catch (error) {
      this.parchear(orden.id, { asignado_a: anterior });
      throw error;
    }
  }
}

// ── Reglas de presentación (mismo criterio que valida el backend) ──────────

export function estaEnPipeline(orden: Orden): boolean {
  return ESTADOS_PIPELINE.includes(orden.estado);
}

export function estaVencida(orden: Orden): boolean {
  return estaEnPipeline(orden) && orden.fecha_entrega < hoyISO();
}

/** Etapas a las que esta orden puede moverse desde su estado actual. */
export function estadosDisponibles(orden: Orden): EstadoOrden[] {
  if (estaEnPipeline(orden)) return ESTADOS_PIPELINE;
  // 'finalizada' se muestra con su estado actual y puede pasar a 'entregada'.
  if (orden.estado === 'finalizada') return ['finalizada', 'entregada'];
  return [];
}

export function claseEstado(estado: EstadoOrden): string {
  return 'badge-estado-' + estado.replace('_', '-');
}

/** Filtra la lista por etapa, texto libre y rango de fechas de creación. */
export function filtrarOrdenes(
  ordenes: Orden[],
  opciones: { estado?: string; texto?: string; desde?: string; hasta?: string; canal?: string },
): Orden[] {
  const texto = (opciones.texto ?? '').toLowerCase().trim();

  return ordenes.filter(orden => {
    if (opciones.estado && opciones.estado !== 'todos' && orden.estado !== opciones.estado) {
      return false;
    }

    if (opciones.canal && orden.canal_ingreso !== opciones.canal) {
      return false;
    }

    if (texto) {
      const coincide =
        orden.id_documento?.toLowerCase().includes(texto) ||
        orden.cliente?.toLowerCase().includes(texto) ||
        orden.descripcion?.toLowerCase().includes(texto);
      if (!coincide) return false;
    }

    if (opciones.desde || opciones.hasta) {
      const fecha = aFechaISO(orden.fecha_creacion);
      if (opciones.desde && fecha < opciones.desde) return false;
      if (opciones.hasta && fecha > opciones.hasta) return false;
    }

    return true;
  });
}
