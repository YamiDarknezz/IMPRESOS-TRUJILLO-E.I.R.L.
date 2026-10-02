/**
 * Catálogo de prueba, con la forma que devuelve `GET /api/configuracion`.
 *
 * Los specs no hablan con el servidor, así que hidratan el estado con esto:
 * es lo mismo que ocurre al iniciar sesión en la aplicación real.
 */
import { Catalogos, ParametrosNegocio } from './catalogos';

export const PARAMETROS_DE_PRUEBA: ParametrosNegocio = {
  igv_porcentaje: 18,
  adelanto_minimo_porcentaje: 50,
};

export const CATALOGOS_DE_PRUEBA: Catalogos = {
  metodos_pago: [
    { valor: 'efectivo', etiqueta: 'Efectivo' },
    { valor: 'yape', etiqueta: 'Yape' },
    { valor: 'transferencia', etiqueta: 'Transferencia' },
  ],
  tipos_pago: [
    { valor: 'adelanto', etiqueta: 'Adelanto' },
    { valor: 'saldo', etiqueta: 'Saldo' },
  ],
  estados_pago: [
    { valor: 'conforme', etiqueta: 'Conforme' },
    { valor: 'observado', etiqueta: 'Observado' },
    { valor: 'anulado', etiqueta: 'Anulado' },
  ],
  motivos_observacion: [
    { valor: 'yape_falso', etiqueta: 'Yape falso / Captura trucada' },
    { valor: 'otro', etiqueta: 'Otro motivo' },
  ],
  motivos_movimiento: [
    { valor: 'reserva', etiqueta: 'Reserva por orden' },
    { valor: 'ajuste_manual', etiqueta: 'Ajuste manual' },
  ],
  // El catálogo completo, como el que publica el backend: los specs comprueban
  // las etiquetas de acciones que antes faltaban en la copia del frontend.
  acciones_auditoria: [
    { valor: 'crear', etiqueta: 'Crear' },
    { valor: 'editar', etiqueta: 'Editar' },
    { valor: 'eliminar', etiqueta: 'Eliminar' },
    { valor: 'cambio_estado', etiqueta: 'Cambio de estado' },
    { valor: 'pago', etiqueta: 'Pago' },
    { valor: 'ajuste_stock', etiqueta: 'Ajuste de stock' },
    { valor: 'sesion', etiqueta: 'Sesión' },
    { valor: 'sesion_fallida', etiqueta: 'Intento de sesión fallido' },
    { valor: 'cierre_caja', etiqueta: 'Cierre de caja' },
    { valor: 'observacion_pago', etiqueta: 'Observación de pago' },
  ],
};
