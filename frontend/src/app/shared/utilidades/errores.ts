/**
 * Extrae el mensaje que el backend envía en `detail`.
 *
 * El backend manda mensajes pensados para el usuario ("Se requiere un
 * adelanto...", "Stock insuficiente para 'Lona'..."), así que se muestran tal
 * cual. Si no hay mensaje, se usa el respaldo que indique quien llama.
 */
export function mensajeDeError(error: unknown, respaldo: string): string {
  const detalle = (error as { error?: { detail?: string } })?.error?.detail;
  return typeof detalle === 'string' && detalle.trim() ? detalle : respaldo;
}
