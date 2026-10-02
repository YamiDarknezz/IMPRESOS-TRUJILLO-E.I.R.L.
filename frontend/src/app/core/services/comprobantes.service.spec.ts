import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ComprobantesService } from './comprobantes.service';
import { Comprobante } from '../models';
import { environment } from '../../../environments/environment';

function comprobante(sobrescribe: Partial<Comprobante> = {}): Comprobante {
  return {
    id: 1,
    orden_id: 1,
    pago_id: null,
    nombre_original: 'yape.jpg',
    tipo_mime: 'image/webp',
    tamano_bytes: 150 * 1024,
    subido_por: 1,
    subido_por_nombre: 'Ana',
    subido_en: '2026-10-02T10:00:00Z',
    url: '/api/comprobantes/abc123.webp',
    ...sobrescribe,
  };
}

describe('ComprobantesService', () => {
  let apiFalsa: { subir: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let servicio: ComprobantesService;

  beforeEach(() => {
    apiFalsa = { subir: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(ComprobantesService);
  });

  it('subir() manda el archivo como formulario, sin `pago_id` en el adelanto', async () => {
    apiFalsa.subir.mockResolvedValue({ status: 'success', data: comprobante() });
    const archivo = new File(['contenido'], 'yape.pdf', { type: 'application/pdf' });

    const subido = await servicio.subir(3, archivo);

    expect(subido.id).toBe(1);
    const [ruta, formulario] = apiFalsa.subir.mock.calls[0];
    expect(ruta).toBe('/api/ordenes/3/comprobantes');
    expect(formulario.get('archivo')).toBeInstanceOf(File);
    expect(formulario.get('pago_id')).toBeNull();
  });

  it('subir() con pago adjunta la captura a ese abono', async () => {
    apiFalsa.subir.mockResolvedValue({ status: 'success', data: comprobante({ pago_id: 9 }) });

    await servicio.subir(3, new File(['x'], 'yape.jpg', { type: 'image/jpeg' }), 9);

    expect(apiFalsa.subir.mock.calls[0][1].get('pago_id')).toBe('9');
  });

  it('si una captura falla, las demás se suben igual', async () => {
    apiFalsa.subir
      .mockRejectedValueOnce({ error: { detail: 'La captura pesa más de 5 MB.' } })
      .mockResolvedValueOnce({ status: 'success', data: comprobante({ id: 2 }) });

    const resultado = await servicio.subirVarias(3, [
      new File(['a'], 'grande.pdf', { type: 'application/pdf' }),
      new File(['b'], 'chica.pdf', { type: 'application/pdf' }),
    ]);

    expect(apiFalsa.subir).toHaveBeenCalledTimes(2);
    expect(resultado.subidos.map(c => c.id)).toEqual([2]);
    expect(resultado.fallidos).toEqual([
      { nombre: 'grande.pdf', motivo: 'La captura pesa más de 5 MB.' },
    ]);
  });

  it('subir() avisa cuando la única captura no pudo subir', async () => {
    apiFalsa.subir.mockRejectedValue({ error: { detail: 'Solo se aceptan capturas en JPG.' } });

    await expect(servicio.subir(3, new File(['x'], 'raro.txt', { type: 'text/plain' })))
      .rejects.toThrow('Solo se aceptan capturas en JPG.');
  });

  it('urlDe() apunta a la API y no al almacén', () => {
    // La ruta guardada es la de la API: cambiar de almacén no rompe nada.
    expect(servicio.urlDe(comprobante())).toBe(
      `${environment.apiUrl}/api/comprobantes/abc123.webp`
    );
  });

  it('resumen() dice el formato y el peso final', () => {
    expect(servicio.resumen(comprobante())).toBe('WebP · 150 KB');
    expect(servicio.resumen(comprobante({ tipo_mime: 'application/pdf', tamano_bytes: 2_400_000 })))
      .toBe('PDF · 2.3 MB');
  });
});
