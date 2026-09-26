import { descargarCSV } from './csv';

describe('descargarCSV', () => {
  let clickSpy: ReturnType<typeof vi.spyOn>;
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let blobCapturado: Blob | undefined;

  beforeEach(() => {
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    createObjectURLSpy = vi.fn((blob: Blob) => {
      blobCapturado = blob;
      return 'blob:falso';
    });
    revokeObjectURLSpy = vi.fn();
    URL.createObjectURL = createObjectURLSpy as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = revokeObjectURLSpy as unknown as typeof URL.revokeObjectURL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    blobCapturado = undefined;
  });

  it('arma un Blob de tipo CSV y dispara la descarga', () => {
    descargarCSV('reporte.csv', [['a', 'b'], [1, 2]]);

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(blobCapturado?.type).toBe('text/csv;charset=utf-8;');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:falso');
  });

  it('separa las columnas con coma y las filas con salto de línea', async () => {
    descargarCSV('reporte.csv', [['Concepto', 'Monto'], ['Ingresos', 100]]);
    // `Blob.text()` decodifica con TextDecoder, que descarta el BOM inicial
    // automáticamente (así lo exige la especificación WHATWG).
    const texto = await blobCapturado!.text();
    expect(texto).toBe('Concepto,Monto\r\nIngresos,100');
  });

  it('entrecomilla valores que traen coma, comillas o salto de línea', async () => {
    descargarCSV('reporte.csv', [['Impresos "Trujillo", S.A.'], ['línea uno\nlínea dos']]);
    const texto = await blobCapturado!.text();
    expect(texto).toBe('"Impresos ""Trujillo"", S.A."\r\n"línea uno\nlínea dos"');
  });

  it('trata null/undefined como celda vacía', async () => {
    descargarCSV('reporte.csv', [[null, undefined, 'x']]);
    const texto = await blobCapturado!.text();
    expect(texto).toBe(',,x');
  });
});
