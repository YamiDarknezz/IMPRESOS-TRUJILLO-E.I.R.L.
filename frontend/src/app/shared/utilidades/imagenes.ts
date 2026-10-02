/**
 * Reduce la captura antes de subirla (RF-11, issue #67).
 *
 * Una captura de celular pesa entre 2 y 4 MB y sale por la conexión de la
 * oficina. Redimensionándola al lado mayor de pantalla y guardándola en WebP
 * queda en unos 150 KB: se sube rápido y no infla el respaldo.
 *
 * El servidor optimiza igual (y valida que sea una imagen de verdad); esto es
 * para no gastar datos ni tiempo de espera de la secretaria.
 */

/** Lado mayor al que se reduce. Suficiente para leer un voucher en pantalla. */
export const LADO_MAXIMO = 1600;

/** Calidad del WebP. Más abajo ya se ven artefactos alrededor del texto. */
export const CALIDAD = 0.82;

export function esImagen(archivo: File): boolean {
  return archivo.type.startsWith('image/');
}

/** ¿Merece la pena intentar comprimirlo? Un PDF no se toca. */
export function sePuedeComprimir(archivo: File): boolean {
  return esImagen(archivo) && archivo.type !== 'image/gif';
}

/** Si el navegador no logra procesar la imagen, se sigue con la original. */
const ESPERA_MAXIMA_MS = 3000;

function conTiempoLimite<T>(promesa: Promise<T>, milisegundos: number): Promise<T> {
  return new Promise((resolver, rechazar) => {
    const reloj = setTimeout(
      () => rechazar(new Error('La imagen tardó demasiado en procesarse')),
      milisegundos
    );
    promesa.then(
      valor => { clearTimeout(reloj); resolver(valor); },
      error => { clearTimeout(reloj); rechazar(error); }
    );
  });
}

function abrirImagen(archivo: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') return createImageBitmap(archivo);

  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    imagen.onload = () => resolver(imagen);
    imagen.onerror = () => rechazar(new Error('No se pudo leer la imagen'));
    imagen.src = URL.createObjectURL(archivo);
  });
}

function nombreWebp(nombre: string): string {
  return `${nombre.replace(/\.[^./]+$/, '')}.webp`;
}

/**
 * Devuelve la versión comprimida o el archivo original.
 *
 * Nunca lanza: si el navegador no puede procesarla, subir la original es
 * mejor que impedir el trabajo. El servidor la recibirá tal cual.
 */
export async function comprimirCaptura(archivo: File): Promise<File> {
  if (!sePuedeComprimir(archivo) || typeof document === 'undefined') return archivo;

  try {
    const imagen = await conTiempoLimite(abrirImagen(archivo), ESPERA_MAXIMA_MS);
    const anchoOriginal = imagen.width;
    const altoOriginal = imagen.height;
    const escala = Math.min(1, LADO_MAXIMO / Math.max(anchoOriginal, altoOriginal));

    const lienzo = document.createElement('canvas');
    lienzo.width = Math.max(1, Math.round(anchoOriginal * escala));
    lienzo.height = Math.max(1, Math.round(altoOriginal * escala));

    const pincel = lienzo.getContext('2d');
    if (!pincel) return archivo;
    // Fondo blanco: un PNG con transparencia guardado en WebP se vería raro
    // sobre el fondo oscuro de algunas vistas.
    pincel.fillStyle = '#ffffff';
    pincel.fillRect(0, 0, lienzo.width, lienzo.height);
    pincel.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);

    const comprimido = await new Promise<Blob | null>((resolver) =>
      lienzo.toBlob(resolver, 'image/webp', CALIDAD)
    );

    // Si no mejora nada, se manda el original: recomprimir por gusto solo
    // empeora la imagen.
    if (!comprimido || comprimido.size >= archivo.size) return archivo;

    return new File([comprimido], nombreWebp(archivo.name), {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch {
    return archivo;
  }
}

/** Peso en KB o MB, para mostrarlo junto al adjunto. */
export function pesoLegible(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Captura elegida en un formulario, todavía sin subir. */
export interface CapturaElegida {
  archivo: File;
  nombre: string;
  peso: number;
  /** URL local para la miniatura. Vacía si es un PDF. */
  vista: string;
}

export function capturaValida(archivo: File): boolean {
  return sePuedeComprimir(archivo) || archivo.type === 'application/pdf';
}

/** Prepara un archivo elegido para mostrarlo en la lista de adjuntos. */
export function prepararCaptura(archivo: File): CapturaElegida {
  return {
    archivo,
    nombre: archivo.name,
    peso: archivo.size,
    // Las capturas de celular ya son JPEG; solo se previsualiza lo que el
    // navegador puede mostrar.
    vista: archivo.type.startsWith('image/') ? URL.createObjectURL(archivo) : '',
  };
}

/** Suelta la URL de la miniatura: sin esto, cada captura queda en memoria. */
export function liberarCaptura(captura: CapturaElegida): void {
  if (captura.vista) URL.revokeObjectURL(captura.vista);
}

/** Separa lo que se puede adjuntar de lo que no, para poder avisar. */
export function capturasDesdeArchivos(entrada: FileList | null): {
  aceptadas: CapturaElegida[];
  rechazadas: number;
} {
  const elegidos = Array.from(entrada ?? []);
  const aceptadas = elegidos.filter(capturaValida).map(prepararCaptura);
  return { aceptadas, rechazadas: elegidos.length - aceptadas.length };
}
