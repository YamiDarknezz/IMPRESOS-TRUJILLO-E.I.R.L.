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
  /** Lo adelantado y lo pagado en total, sin contar pagos observados (#110). */
  total_adelantado?: number;
  total_pagado?: number;
  historial_pagos?: PagoHistorial[];
}

/** Un pago en el historial del cliente, del más reciente al más antiguo. */
export interface PagoHistorial {
  pago_id: number;
  orden_id: number;
  orden_codigo: string;
  fecha: string;
  tipo: 'adelanto' | 'saldo';
  monto: number;
  metodo: string;
  descripcion: string;
  referencia: string;
  estado_pago: 'conforme' | 'observado' | 'anulado';
  /** Lo que le faltaba pagar a la orden después de este pago; nulo si no cuenta. */
  saldo_despues: number | null;
}
