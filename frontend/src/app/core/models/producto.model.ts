import { MaterialItem } from './comunes.model';

export type TipoProducto = 'propio' | 'servicio' | 'subcontratado';

export const TIPOS_PRODUCTO: TipoProducto[] = ['propio', 'servicio', 'subcontratado'];

export const ETIQUETA_TIPO_PRODUCTO: Record<TipoProducto, string> = {
  propio:        'Propio',
  servicio:      'Servicio',
  subcontratado: 'Subcontratado',
};

/** Línea de la receta: material y cantidad por unidad de producto. */
export interface RecetaItem {
  material_id: number;
  cantidad: number;
}

export interface Producto {
  id: number;
  nombre: string;
  tipo: TipoProducto;
  precio_base: number;
  notas: string;
  /** Presentación con nombre del material (la usa el formulario de órdenes). */
  materiales?: MaterialItem[];
  /** Receta tal como la espera el backend para guardar. */
  receta?: RecetaItem[];
  activo?: boolean;
}
