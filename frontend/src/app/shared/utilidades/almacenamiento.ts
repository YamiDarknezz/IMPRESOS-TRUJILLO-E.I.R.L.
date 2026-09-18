/**
 * Acceso a localStorage que nunca lanza excepción.
 *
 * En navegación privada o con las cookies bloqueadas, leer o escribir
 * localStorage lanza. Son preferencias de interfaz: si fallan, la aplicación
 * debe seguir funcionando con el valor por defecto.
 */

export function leerPreferencia(clave: string, porDefecto = ''): string {
  try {
    return localStorage.getItem(clave) ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

export function guardarPreferencia(clave: string, valor: string): void {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    // Sin almacenamiento disponible: la preferencia se pierde al recargar.
  }
}

export function borrarPreferencia(clave: string): void {
  try {
    localStorage.removeItem(clave);
  } catch {
    // Sin almacenamiento disponible no hay nada que borrar.
  }
}
