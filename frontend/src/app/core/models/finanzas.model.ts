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
  por_trabajador: FilaTrabajador[];
}
