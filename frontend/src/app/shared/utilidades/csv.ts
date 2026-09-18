/** Generación y descarga de archivos CSV que Excel abra correctamente. */

/** Envuelve en comillas solo si el valor las necesita. */
function escapar(valor: unknown): string {
  const texto = String(valor ?? '');
  return /[",\n]/.test(texto) ? '"' + texto.replace(/"/g, '""') + '"' : texto;
}

/**
 * Descarga las filas como CSV.
 *
 * Lleva un BOM al inicio porque sin él Excel abre el archivo en su
 * codificación regional y las tildes y la ñ salen rotas.
 */
export function descargarCSV(nombreArchivo: string, filas: unknown[][]): void {
  const BOM = String.fromCharCode(0xfeff);
  const contenido = BOM + filas.map(fila => fila.map(escapar).join(',')).join('\r\n');

  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();

  URL.revokeObjectURL(url);
}
