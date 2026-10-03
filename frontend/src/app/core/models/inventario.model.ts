import { MetodoPago } from './comunes.model';

export type TipoFormatoMaterial =
  | 'continuo_rollo'
  | 'plancha_rigida'
  | 'unidad_pieza'
  | 'quimico_tinta';

export type EstadoPieza = 'disponible' | 'en_uso' | 'agotado';

export interface MaterialInventario {
  id: number;
  nombre: string;
  unidad_id: number;
  /** Abreviatura de la unidad (m2, und, kg...). */
  unidad: string;
  stock_actual: number;
  alerta_minima: number;
  /** Días que demora reponer este material. */
  dias_reabastecimiento?: number;
  /** Lo calcula el servidor: stock por debajo del punto de pedido. */
  stock_bajo?: boolean;
  precio_compra?: number;
  ubicacion_estante?: string;
  tipo_formato?: TipoFormatoMaterial;
  ancho_predeterminado_m?: number | null;
  largo_predeterminado_m?: number | null;
  espesor_mm?: number | null;
}

export interface Unidad {
  id: number;
  nombre: string;
  abreviatura: string;
  activo?: boolean;
}

export interface MovimientoStock {
  id: number;
  material_id: number;
  material: string;
  orden_id?: number | null;
  delta: number;
  stock_resultante: number;
  motivo: string;
  nota: string;
  usuario: string;
  fecha: string;
}

export interface ConsumoPieza {
  id: number;
  pieza_id: number;
  orden_id?: number | null;
  orden_codigo?: string | null;
  /** Qué rollo, de qué material y cuánto le queda; los trae el listado de cortes de un pedido (#71). */
  pieza_codigo?: string;
  material_nombre?: string;
  unidad_medida?: string;
  saldo_restante_pieza?: number;
  trabajo_descripcion: string;
  cantidad_consumida: number;
  saldo_anterior: number;
  saldo_nuevo: number;
  monto_cobrado: number;
  merma_desperdicio: number;
  fecha: string;
  usuario?: string;
  nota: string;
}

export interface PiezaLoteMaterial {
  id: number;
  material_id: number;
  material_nombre?: string;
  codigo_identificador: string;
  ancho_m?: number | null;
  largo_m?: number | null;
  espesor_mm?: number | null;
  capacidad_inicial: number;
  saldo_restante: number;
  unidad_medida: string;
  costo_adquisicion: number;
  estado: EstadoPieza;
  ubicacion: string;
  maquina_asignada: string;
  fecha_ingreso: string;
  fecha_termino?: string | null;
  nota: string;
  /** Lo cobrado por sus cortes (#57): ya contabilizado en Caja/Finanzas. */
  total_recaudado: number;
  consumos?: ConsumoPieza[];
}

export interface PiezaLoteCreateData {
  material_id: number;
  codigo_identificador: string;
  capacidad_inicial: number;
  unidad_medida?: string;
  costo_adquisicion?: number;
  ancho_m?: number | null;
  largo_m?: number | null;
  espesor_mm?: number | null;
  ubicacion?: string;
  maquina_asignada?: string;
  nota?: string;
}

export interface ConsumoPiezaCreateData {
  trabajo_descripcion: string;
  cantidad_consumida: number;
  orden_id?: number | null;
  /** Cobro del corte (#57): si es mayor a 0, exige método y entra a Caja. */
  monto_cobrado?: number;
  metodo_pago?: MetodoPago;
  referencia?: string;
  merma_desperdicio?: number;
  nota?: string;
}

/** Lo que se llevó un pedido de rollos y planchas, y el total por material (#71). */
export interface RollosDeOrden {
  data: ConsumoPieza[];
  resumen: { material: string; unidad: string; cantidad: number }[];
}
