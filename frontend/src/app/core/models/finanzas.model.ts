export interface FilaTrabajador {
  uid: number | null;
  nombre: string;
  contratos: number;
  ingresos: number;
  por_cobrar: number;
  ordenes: number;
}

export interface ResumenUnidad {
  contratos: number;
  ingresos: number;
  por_cobrar: number;
}

export interface ResumenFinanzas {
  es_supervisor: boolean;
  /** Por fecha de creación de la orden: lo vendido. */
  total_contratos: number;
  total_por_cobrar: number;
  total_ordenes: number;
  total_ordenes_canceladas?: number;
  /** Por fecha real de cada pago: lo cobrado. */
  total_ingresos: number;
  total_adelantos: number;
  por_metodo: Record<string, number>;
  /** Caja dual: Imprenta vs. Gigantografías. */
  por_unidad_negocio: Record<string, ResumenUnidad>;
  /** Por vía de ingreso del pedido (#69). */
  por_canal_ingreso?: Record<string, ResumenUnidad>;
  por_trabajador: FilaTrabajador[];
}

/** Antigüedad de la deuda, en tramos de días (#72). */
export interface TramosAntiguedad {
  d0_30: number;
  d31_60: number;
  d61_90: number;
  d90_mas: number;
}

export interface OrdenPorCobrar {
  orden_id: number;
  codigo: string;
  estado: string;
  total: number;
  saldo_pendiente: number;
  fecha_referencia: string;
  dias: number;
  tramo: keyof TramosAntiguedad;
  entregada_con_saldo: boolean;
  entrega_autorizada_por: string | null;
  entrega_motivo: string;
}

export interface ClientePorCobrar {
  cliente_id: number;
  cliente: string;
  es_corporativo: boolean;
  saldo_pendiente: number;
  dias_mayor_antiguedad: number;
  tramos: TramosAntiguedad;
  ordenes: OrdenPorCobrar[];
}

/** Lo que debe cada cliente, con la antigüedad de la deuda (#72). */
export interface CuentasPorCobrar {
  fecha_corte: string;
  solo_proformas: boolean;
  total_pendiente: number;
  tramos: TramosAntiguedad;
  clientes: ClientePorCobrar[];
}
