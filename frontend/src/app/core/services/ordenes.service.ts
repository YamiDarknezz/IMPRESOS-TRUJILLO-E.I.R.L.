import { Injectable, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { InventarioService } from './inventario.service';
import {
  ESTADOS_CERRADOS,
  ESTADOS_PIPELINE,
  EstadoOrden,
  MaterialItem,
  MetodoPago,
  Orden,
  RespuestaItem,
  TipoDocumento,
  UnidadNegocio,
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
}

@Injectable({ providedIn: 'root' })
export class OrdenesService {
  private api = inject(ApiService);
  private inventario = inject(InventarioService);

  private lista = new ListaRemota<Orden>(this.api, '/api/ordenes');

  readonly ordenes = this.lista.items;
  readonly cargando = this.lista.cargando;

  cargar = (forzar = false) => this.lista.cargar(forzar);
  recargar = () => this.lista.recargar();

  /**
   * Recarga órdenes e inventario a la vez: toda operación sobre una orden
   * mueve stock, así que mostrar una sin la otra deja la pantalla inconsistente.
   */
  private async recargarConInventario(): Promise<void> {
    await Promise.all([this.lista.recargar(), this.inventario.recargar()]);
  }

  // ── Métricas del panel ───────────────────────────────────────────────────

  readonly enProceso = computed(() =>
    this.ordenes().filter(o => estaEnPipeline(o)).length
  );

  readonly finalizadas = computed(() =>
    this.ordenes().filter(o => ESTADOS_CERRADOS.includes(o.estado)).length
  );

  readonly vencidas = computed(() =>
    this.ordenes().filter(o => estaEnPipeline(o) && o.fecha_entrega < hoyISO()).length
  );

  readonly porCobrar = computed(() =>
    this.ordenes()
      .filter(o => o.estado !== 'cancelada' && !o.finanzas?.pagado_totalmente)
      .reduce((suma, o) => suma + (o.finanzas?.saldo_pendiente ?? 0), 0)
  );

  // ── Operaciones ──────────────────────────────────────────────────────────

  async crear(datos: DatosOrden): Promise<void> {
    await this.api.post<RespuestaItem<Orden>>('/api/ordenes', datos);
    await this.recargarConInventario();
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

  async confirmarPago(idOrden: number, metodo: MetodoPago, referencia = ''): Promise<void> {
    await this.api.post(`/api/ordenes/${idOrden}/confirmar-pago`, {
      metodo_pago: metodo,
      referencia,
    });
    await this.lista.recargar();
  }

  /**
   * Cambia la etapa mostrando el resultado de inmediato y revirtiendo si el
   * servidor lo rechaza. Mueve solo un campo, así que no hace falta recargar
   * toda la lista.
   */
  async cambiarEstado(orden: Orden, estado: EstadoOrden): Promise<void> {
    const anterior = orden.estado;
    orden.estado = estado;
    try {
      await this.api.post(`/api/ordenes/${orden.id}/estado`, { estado });
    } catch (error) {
      orden.estado = anterior;
      throw error;
    }
  }

  async asignar(orden: Orden, idUsuario: number | null): Promise<void> {
    const anterior = orden.asignado_a;
    orden.asignado_a = idUsuario;
    try {
      await this.api.post(`/api/ordenes/${orden.id}/asignar`, { asignado_a: idUsuario });
    } catch (error) {
      orden.asignado_a = anterior;
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
  opciones: { estado?: string; texto?: string; desde?: string; hasta?: string },
): Orden[] {
  const texto = (opciones.texto ?? '').toLowerCase().trim();

  return ordenes.filter(orden => {
    if (opciones.estado && opciones.estado !== 'todos' && orden.estado !== opciones.estado) {
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
