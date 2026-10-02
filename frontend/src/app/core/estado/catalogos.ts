/**
 * Parámetros y catálogos del negocio, tal como los publica el servidor (#54).
 *
 * Vive en un módulo y no en un servicio inyectable a propósito: lo leen
 * plantillas de media aplicación y no aporta nada obligar a cada una a
 * inyectarlo. El servicio `ConfiguracionService` lo hidrata al iniciar sesión.
 *
 * Mientras el servidor responde, `parametros` arranca con los valores de
 * fábrica del backend (18 % y 50 %) y los catálogos vacíos: el primer render no
 * puede quedar sin IGV. En cuanto llega la respuesta, la fuente pasa a ser el
 * servidor y cambiar `IGV_PORCENTAJE` en el `.env` se refleja en la pantalla.
 */
import { computed, signal } from '@angular/core';

export interface OpcionCatalogo {
  valor: string;
  etiqueta: string;
}

export interface ParametrosNegocio {
  igv_porcentaje: number;
  adelanto_minimo_porcentaje: number;
}

export interface Catalogos {
  metodos_pago: OpcionCatalogo[];
  tipos_pago: OpcionCatalogo[];
  estados_pago: OpcionCatalogo[];
  motivos_observacion: OpcionCatalogo[];
  motivos_movimiento: OpcionCatalogo[];
  acciones_auditoria: OpcionCatalogo[];
}

export type NombreCatalogo = keyof Catalogos;

const VACIO: Catalogos = {
  metodos_pago: [],
  tipos_pago: [],
  estados_pago: [],
  motivos_observacion: [],
  motivos_movimiento: [],
  acciones_auditoria: [],
};

const parametros = signal<ParametrosNegocio>({
  igv_porcentaje: 18,
  adelanto_minimo_porcentaje: 50,
});
const catalogos = signal<Catalogos>(VACIO);
/** ¿Ya respondió el servidor? Sirve para saber si se puede confiar en los catálogos. */
const configurada = signal(false);

/** Guarda lo que devolvió `GET /api/configuracion`. */
export function hidratarConfiguracion(datos: {
  parametros: ParametrosNegocio;
  catalogos: Catalogos;
}): void {
  parametros.set(datos.parametros);
  catalogos.set({ ...VACIO, ...datos.catalogos });
  configurada.set(true);
}

/**
 * Vuelve al estado inicial.
 *
 * El estado vive en el módulo, así que en las pruebas se filtra de un archivo a
 * otro; esto deja cada una empezando de cero.
 */
export function reiniciarConfiguracion(): void {
  parametros.set({ igv_porcentaje: 18, adelanto_minimo_porcentaje: 50 });
  catalogos.set(VACIO);
  configurada.set(false);
}

export const configuracionLista = configurada.asReadonly();
export const igvPorcentaje = computed(() => parametros().igv_porcentaje);
export const adelantoMinimoPorcentaje = computed(() => parametros().adelanto_minimo_porcentaje);

/** Lista de valores de un catálogo, tal como los espera el servidor. */
export function valoresDe(nombre: NombreCatalogo): string[] {
  return catalogos()[nombre].map(opcion => opcion.valor);
}

/** Mapa valor -> nombre legible, para los desplegables y las tablas. */
export function etiquetasDe(nombre: NombreCatalogo): Record<string, string> {
  return Object.fromEntries(catalogos()[nombre].map(o => [o.valor, o.etiqueta]));
}

/**
 * Nombre legible de un valor.
 *
 * Si el catálogo todavía no llegó (o el servidor agregó un valor que esta
 * versión no conoce), se muestra el valor sin guiones bajos en lugar del texto
 * crudo: `observacion_pago` se leería como "observacion pago", que es lo que
 * pasaba antes en /auditoria.
 */
export function etiquetaDe(nombre: NombreCatalogo, valor: string): string {
  return etiquetasDe(nombre)[valor] ?? valor.replace(/_/g, ' ');
}

// Atajos para las plantillas, que es donde más se usan.
export const metodosPago = computed(() => valoresDe('metodos_pago'));
export const etiquetasMetodo = computed(() => etiquetasDe('metodos_pago'));
export const opcionesAccion = computed(() => catalogos().acciones_auditoria);
export const etiquetasAccion = computed(() => etiquetasDe('acciones_auditoria'));
export const motivosObservacion = computed(() => catalogos().motivos_observacion);
export const motivosMovimiento = computed(() => catalogos().motivos_movimiento);

export function etiquetaMovimiento(valor: string): string {
  return etiquetaDe('motivos_movimiento', valor);
}
