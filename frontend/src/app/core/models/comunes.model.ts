/** Tipos compartidos por varios dominios. */

/**
 * `yape` es el heredado: así se registraban los pagos antes de poder elegir el
 * número (#125). Se muestra en lo ya guardado pero no se ofrece al cobrar.
 */
export type MetodoPago = 'efectivo' | 'yape_marcell' | 'yape_angel' | 'transferencia' | 'yape';

/** Métodos que se ofrecen al registrar un pago nuevo. */
export const METODOS_PAGO: MetodoPago[] = ['efectivo', 'yape_marcell', 'yape_angel', 'transferencia'];

export const ETIQUETA_METODO: Record<MetodoPago, string> = {
  efectivo: 'Efectivo',
  yape_marcell: 'Yape Marcell',
  yape_angel: 'Yape Ángel',
  transferencia: 'Transferencia',
  yape: 'Yape (sin especificar)',
};

/** Un material con su cantidad: se usa en órdenes y en recetas de producto. */
export interface MaterialItem {
  id_material: number;
  nombre: string;
  cantidad: number;
  unidad?: string;
  /** Rollo o plancha de donde sale (#127): la orden le descuenta la cantidad al crearse. */
  pieza_id?: number | null;
}

/** Forma en que la API devuelve cualquier listado. */
export interface RespuestaLista<T> {
  status: string;
  data: T[];
  /** Total de registros que cumplen el filtro; lo informan los listados paginados. */
  total?: number | null;
}

/** Forma en que la API devuelve un solo elemento. */
export interface RespuestaItem<T> {
  status: string;
  data: T;
}
