export interface IndicadoresBI {
  ordenes: number;
  valor_ordenes: number;
  cobros: number;
  ticket_promedio: number;
  liquidadas: number;
  porcentaje_liquidadas: number | null;
}

export interface PendienteBI {
  id: number;
  codigo: string;
  cliente: string;
  estado: string;
  fecha_entrega: string;
  total: number;
  saldo: number;
}

export interface ResumenBI {
  generado_en: string;
  fecha_corte: string;
  primera_orden: string | null;
  periodo: { desde: string; hasta: string; dia_parcial: boolean };
  indicadores: IndicadoresBI;
  comparacion: {
    desde: string; hasta: string; disponible: boolean; indicadores: IndicadoresBI;
  };
  serie_diaria: { fecha: string; ventas: number; cobros: number }[];
  por_linea: { clave: string; ordenes: number; ventas: number; ticket: number }[];
  por_canal: { clave: string; ordenes: number; ventas: number; ticket: number }[];
  cobros_por_metodo: { metodo: string; monto: number }[];
  cobranza: {
    saldo_actual: number;
    entregado_autorizado_con_deuda: number;
    por_linea: { clave: string; ordenes: number; saldo: number }[];
    clientes: { id: number; nombre: string; ordenes: number; saldo: number }[];
    vencida_por_entrega: Record<string, number>;
  };
  operacion: {
    ordenes: number; fecha_vencida: number; listas_pagadas: number; listas_con_deuda: number;
    sin_asignar: number; saldo_finalizadas: number;
    por_estado: { estado: string; ordenes: number }[];
    para_entregar: PendienteBI[]; para_cobrar: PendienteBI[]; vencidas: PendienteBI[];
    horas_hasta_finalizar: number | null; finalizadas_con_fecha: number;
  };
  clientes: {
    total: number; recurrentes: number; ventas_recurrentes: number;
    principales: { id: number; nombre: string; ordenes: number; ventas: number }[];
  };
  calidad: { pagos_en_canceladas: number; ordenes_descuadradas: number; ids_descuadradas: number[] };
}
