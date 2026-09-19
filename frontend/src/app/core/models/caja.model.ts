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

export interface DetalleCaja {
  orden: string;
  orden_id: number;
  cliente: string;
  unidad_negocio: UnidadNegocio;
  metodo: string;
  tipo: string;
  monto: number;
  fecha: string;
  usuario_id: number | null;
}

export interface ResumenCaja {
  fecha: string;
  total: AcumuladoCaja;
  por_unidad_negocio: Record<string, AcumuladoCaja>;
  por_usuario: FilaCajaUsuario[];
  detalle: DetalleCaja[];
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
