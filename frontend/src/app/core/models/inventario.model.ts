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
