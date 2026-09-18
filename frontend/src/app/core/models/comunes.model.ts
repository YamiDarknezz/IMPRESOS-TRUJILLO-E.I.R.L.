/** Tipos compartidos por varios dominios. */

export type MetodoPago = 'efectivo' | 'yape' | 'transferencia';

export const METODOS_PAGO: MetodoPago[] = ['efectivo', 'yape', 'transferencia'];

export const ETIQUETA_METODO: Record<MetodoPago, string> = {
  efectivo: 'Efectivo',
  yape: 'Yape',
  transferencia: 'Transferencia',
};

/** Un material con su cantidad: se usa en órdenes y en recetas de producto. */
export interface MaterialItem {
  id_material: number;
  nombre: string;
  cantidad: number;
  unidad?: string;
}

/** Forma en que la API devuelve cualquier listado. */
export interface RespuestaLista<T> {
  status: string;
  data: T[];
}

/** Forma en que la API devuelve un solo elemento. */
export interface RespuestaItem<T> {
  status: string;
  data: T;
}
