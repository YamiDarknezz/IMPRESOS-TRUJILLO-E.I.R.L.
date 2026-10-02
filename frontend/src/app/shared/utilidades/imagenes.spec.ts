import {
  CALIDAD,
  LADO_MAXIMO,
  capturaValida,
  capturasDesdeArchivos,
  comprimirCaptura,
  pesoLegible,
  sePuedeComprimir,
} from './imagenes';

function archivo(nombre: string, tipo: string, contenido = 'x'): File {
  return new File([contenido], nombre, { type: tipo });
}

describe('pesoLegible()', () => {
  it('usa la unidad según el tamaño', () => {
    expect(pesoLegible(900)).toBe('900 B');
    expect(pesoLegible(150 * 1024)).toBe('150 KB');
    expect(pesoLegible(2.4 * 1024 * 1024)).toBe('2.4 MB');
  });
});

describe('qué se puede adjuntar (RF-11)', () => {
  it('acepta capturas en imagen y PDF, y rechaza el resto', () => {
    expect(capturaValida(archivo('yape.jpg', 'image/jpeg'))).toBe(true);
    expect(capturaValida(archivo('yape.png', 'image/png'))).toBe(true);
    expect(capturaValida(archivo('voucher.pdf', 'application/pdf'))).toBe(true);
    expect(capturaValida(archivo('notas.txt', 'text/plain'))).toBe(false);
  });

  it('cuenta las rechazadas para poder avisar', () => {
    const entrada = [archivo('a.jpg', 'image/jpeg'), archivo('b.txt', 'text/plain')] as unknown as FileList;

    const { aceptadas, rechazadas } = capturasDesdeArchivos(entrada);

    expect(aceptadas.map(c => c.nombre)).toEqual(['a.jpg']);
    expect(rechazadas).toBe(1);
  });

  it('no toca un GIF animado: recomprimirlo lo dejaría quieto', () => {
    expect(sePuedeComprimir(archivo('anim.gif', 'image/gif'))).toBe(false);
  });
});

describe('comprimirCaptura()', () => {
  it('si el navegador se atasca con la imagen, sube la original', async () => {
    // Sin decodificador de imágenes (como en estas pruebas) no llega a haber
    // miniatura: el tiempo límite evita que la secretaria se quede esperando.
    vi.useFakeTimers();
    const original = archivo('yape.jpg', 'image/jpeg', 'contenido');

    const pendiente = comprimirCaptura(original);
    await vi.advanceTimersByTimeAsync(4000);
    const resultado = await pendiente;

    expect(resultado).toBe(original);
    vi.useRealTimers();
  });

  it('deja pasar los PDF sin tocarlos', async () => {
    const pdf = archivo('voucher.pdf', 'application/pdf', '%PDF-1.4');

    expect(await comprimirCaptura(pdf)).toBe(pdf);
  });

  it('trabaja con un lado máximo que deja leer el voucher', () => {
    expect(LADO_MAXIMO).toBe(1600);
    expect(CALIDAD).toBeGreaterThan(0.7);
  });
});
