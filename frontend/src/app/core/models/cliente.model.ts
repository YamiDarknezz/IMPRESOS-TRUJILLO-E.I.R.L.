export type TipoCliente = 'persona' | 'empresa';

export const TIPOS_CLIENTE: TipoCliente[] = ['persona', 'empresa'];

export interface Cliente {
  id: number;
  nombre: string;
  tipo: TipoCliente;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  notas: string;
  /** Órdenes corporativas: se exceptúan del adelanto mínimo (RN-01). */
  es_corporativo: boolean;
  activo?: boolean;
  creado_en?: string;
}

/** Ficha financiera del cliente, calculada por el servidor. */
export interface ResumenCliente {
  cliente_id: number;
  total_ordenes: number;
  facturado: number;
  por_cobrar: number;
}
