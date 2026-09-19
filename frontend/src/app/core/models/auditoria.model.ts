export interface EntradaAuditoria {
  id: number;
  usuario_id: number | null;
  usuario: string;
  accion: string;
  tabla_afectada: string;
  registro_id: string;
  detalle: string;
  valores_anteriores?: unknown;
  valores_nuevos?: unknown;
  ip: string;
  fecha: string;
}

/** Nombres legibles de los eventos de auditoría. */
export const ETIQUETA_ACCION: Record<string, string> = {
  crear: 'Crear',
  editar: 'Editar',
  eliminar: 'Eliminar',
  cambio_estado: 'Cambio de estado',
  pago: 'Pago',
  ajuste_stock: 'Ajuste de stock',
  sesion: 'Sesión',
  cierre_caja: 'Cierre de caja',
};
