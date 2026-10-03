import { UnidadNegocio } from './orden.model';

/** Totales del arqueo por método de pago. */
export interface AcumuladoCaja {
  efectivo: number;
  yape: number;
  transferencia: number;
  total: number;
}

/** Lo cobrado de una unidad o de un usuario, con lo que salió por gastos (#112). */
export interface AcumuladoConGastos extends AcumuladoCaja {
  gastos?: number;
  neto?: number;
}

export interface FilaCajaUsuario extends AcumuladoConGastos {
  usuario_id: number | null;
  nombre: string;
}

/** Egreso de la caja del día: tinta, papel, banner... (#112). */
export interface GastoCaja {
  id: number;
  fecha: string;
  unidad_negocio: UnidadNegocio;
  monto: number;
  motivo: string;
  usuario_id: number;
  usuario_nombre: string;
}

export interface GastoCajaData {
  monto: number;
  motivo: string;
  unidad_negocio: UnidadNegocio;
  fecha?: string;
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
  /** Lo gastado, lo cobrado menos lo gastado, y el efectivo que debería quedar. */
  total_gastos?: number;
  neto?: number;
  efectivo_neto?: number;
  gastos?: GastoCaja[];
  por_unidad_negocio: Record<string, AcumuladoConGastos>;
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
  monto_gastos?: number;
  neto?: number;
  estado: EstadoCierre;
  validado_por: number | null;
  validador: string;
  observacion: string;
  creado_en: string;
}
