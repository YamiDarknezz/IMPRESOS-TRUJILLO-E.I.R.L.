import { UnidadNegocio } from './orden.model';

/** Totales del arqueo por método de pago. */
export interface AcumuladoCaja {
  efectivo: number;
  yape: number;
  transferencia: number;
  total: number;
}

export interface FilaCajaUsuario extends AcumuladoCaja {
  usuario_id: number | null;
  nombre: string;
}

export interface PagoObservadoInfo {
  pago_id: number;
  orden: string;
  orden_id: number;
  cliente: string;
  unidad_negocio: string;
  metodo: string;
  monto: number;
  estado_pago: string;
  motivo: string;
  nota: string;
  observado_por: string | null;
  observado_en: string | null;
}

export interface DetalleCaja {
  pago_id?: number;
  orden: string;
  orden_id: number;
  cliente: string;
  unidad_negocio: UnidadNegocio;
  metodo: string;
  tipo: string;
  monto: number;
  fecha: string;
  usuario_id: number | null;
  usuario_nombre?: string;
  estado_pago?: 'conforme' | 'observado' | 'anulado';
  motivo_observacion?: string | null;
  nota_observacion?: string;
  observado_por?: string | null;
  observado_en?: string | null;
}

export interface ResumenCaja {
  fecha: string;
  total: AcumuladoCaja;
  total_observado?: number;
  por_unidad_negocio: Record<string, AcumuladoCaja>;
  por_usuario: FilaCajaUsuario[];
  detalle: DetalleCaja[];
  observados?: PagoObservadoInfo[];
}

export interface ObservarPagoData {
  motivo:
    | 'yape_falso'
    | 'billete_falso'
    | 'voucher_no_ubicado'
    | 'cobro_duplicado'
    | 'error_digitacion'
    | 'otro';
  nota: string;
}

export type EstadoCierre = 'cerrado' | 'congelado';

export interface CierreCaja {
  id: number;
  fecha: string;
  unidad_negocio: UnidadNegocio;
  usuario_id: number;
  usuario: string;
  monto_efectivo: number;
  monto_yape: number;
  monto_transferencia: number;
  total: number;
  estado: EstadoCierre;
  validado_por: number | null;
  validador: string;
  observacion: string;
  creado_en: string;
}
