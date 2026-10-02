import { MaterialItem, MetodoPago } from './comunes.model';

/** Pipeline de producción. 'cancelada' queda fuera del flujo normal. */
export type EstadoOrden =
  | 'pendiente'
  | 'en_diseno'
  | 'aprobado'
  | 'en_produccion'
  | 'finalizada'
  | 'entregada'
  | 'cancelada';

/** Etapas con el trabajo en curso: el stock sigue reservado. */
export const ESTADOS_PIPELINE: EstadoOrden[] = [
  'pendiente', 'en_diseno', 'aprobado', 'en_produccion',
];

/** Etapas posteriores a reportar el consumo real. */
export const ESTADOS_CERRADOS: EstadoOrden[] = ['finalizada', 'entregada'];

export const ETIQUETA_ESTADO: Record<EstadoOrden, string> = {
  pendiente:     'Pendiente',
  en_diseno:     'En diseño',
  aprobado:      'Aprobado',
  en_produccion: 'En producción',
  finalizada:    'Finalizada',
  entregada:     'Entregada',
  cancelada:     'Cancelada',
};

/** El talonario se emite como Contrato o como Proforma. */
export type TipoDocumento = 'contrato' | 'proforma';

export const ETIQUETA_TIPO_DOCUMENTO: Record<TipoDocumento, string> = {
  contrato: 'Contrato',
  proforma: 'Proforma',
};

/**
 * Vía por la que llegó el pedido (#69). Es solo el tipo: los nombres legibles
 * los publica el servidor (`catalogos.canales_ingreso`).
 */
export type CanalIngreso = 'whatsapp' | 'llamada' | 'presencial' | 'correo' | 'otro';

/** Las dos líneas de negocio con caja separada (RN-05). */
export type UnidadNegocio = 'imprenta' | 'gigantografias';

export const UNIDADES_NEGOCIO: UnidadNegocio[] = ['imprenta', 'gigantografias'];

export const ETIQUETA_UNIDAD: Record<UnidadNegocio, string> = {
  imprenta: 'Imprenta',
  gigantografias: 'Gigantografías',
};

/** Captura de Yape o transferencia adjunta a una orden o a uno de sus pagos. */
export interface Comprobante {
  id: number;
  orden_id: number;
  /** Nulo cuando respalda el adelanto; con valor, el abono que respalda. */
  pago_id: number | null;
  nombre_original: string;
  tipo_mime: string;
  tamano_bytes: number;
  subido_por: number | null;
  subido_por_nombre: string;
  subido_en: string;
  /** Ruta en la API. Nunca apunta al almacén: sirve igual si cambia de sitio. */
  url: string;
}

export interface PagoOrden {
  id: number;
  fecha: string;
  monto: number;
  metodo: MetodoPago;
  tipo: 'adelanto' | 'saldo';
  referencia?: string;
  registrado_por?: number | null;
  estado_pago?: 'conforme' | 'observado' | 'anulado';
  motivo_observacion?: string | null;
  nota_observacion?: string;
  observado_por?: string | null;
  observado_en?: string | null;
  comprobantes?: Comprobante[];
}

export interface VentaRapidaData {
  descripcion: string;
  monto_total: number;
  metodo_pago?: MetodoPago;
  unidad_negocio?: UnidadNegocio;
  cliente_nombre?: string;
  referencia?: string;
}

export interface FinanzasOrden {
  precio_total: number;
  subtotal: number;
  igv: number;
  adelanto_pago: number;
  descuento?: number;
  motivo_descuento?: string;
  saldo_pendiente: number;
  metodo_pago_adelanto: MetodoPago;
  pagado_totalmente: boolean;
  pagos?: PagoOrden[];
}

/** Línea del contrato: medidas para gran formato (alto × ancho). */
export interface OrdenItem {
  id?: number;
  producto_id?: number | null;
  descripcion: string;
  ancho_m?: number | null;
  alto_m?: number | null;
  cantidad: number;
  precio_unitario: number;
  importe?: number;
}

export interface Orden {
  id: number;
  id_documento: string;
  codigo: string;
  tipo_documento: TipoDocumento;
  canal_ingreso: CanalIngreso;
  unidad_negocio: UnidadNegocio;
  cliente_id: number;
  cliente: string;
  direccion: string;
  telefono: string;
  descripcion: string;
  estado: EstadoOrden;
  fecha_creacion: string;
  fecha_entrega: string;
  finalizada_en?: string | null;
  entregada_en?: string | null;
  creado_por: number;
  asignado_a: number | null;
  asignado: string;
  incluye_igv: boolean;
  subtotal: number;
  igv: number;
  items: OrdenItem[];
  finanzas?: FinanzasOrden;
  /** Todas las capturas de la orden: la del adelanto y la de cada abono. */
  comprobantes?: Comprobante[];
  materiales?: {
    estimados: MaterialItem[];
    reales?: MaterialItem[];
    mermas?: MaterialItem[];
    devoluciones?: MaterialItem[];
  };
}

/** Fila del formulario de "reportar uso": lo estimado frente a lo real. */
export interface MaterialComplecion {
  id_material: number;
  nombre: string;
  cantidad_estimada: number;
  cantidad_real: number;
}

/** Indicadores del panel de órdenes, sumados en el backend (#27). */
export interface MetricasOrdenes {
  total: number;
  en_proceso: number;
  finalizadas: number;
  vencidas: number;
  por_cobrar: number;
}
