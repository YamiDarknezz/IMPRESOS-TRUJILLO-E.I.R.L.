import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Comprobante, RespuestaItem } from '../models';
import { environment } from '../../../environments/environment';
import { comprimirCaptura, pesoLegible } from '../../shared/utilidades/imagenes';

/** Cómo se nombra cada formato en la ficha de la captura. */
const ETIQUETA_FORMATO: Record<string, string> = {
  'image/webp': 'WebP',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'application/pdf': 'PDF',
};

/**
 * Capturas de Yape o transferencia (RF-11, issue #67).
 *
 * La imagen se comprime aquí antes de salir y el servidor la vuelve a
 * optimizar: lo que queda guardado pesa una fracción de la foto original, sin
 * metadatos de ubicación.
 */
@Injectable({ providedIn: 'root' })
export class ComprobantesService {
  private api = inject(ApiService);

  /** Sube una captura. `pagoId` solo cuando respalda un abono concreto. */
  async subir(ordenId: number, archivo: File, pagoId: number | null = null): Promise<Comprobante> {
    const lista = await this.subirVarias(ordenId, [archivo], pagoId);
    if (lista.subidos.length === 0) {
      throw new Error(lista.fallidos[0]?.motivo ?? 'No se pudo adjuntar la captura.');
    }
    return lista.subidos[0];
  }

  /**
   * Sube varias capturas y no se detiene si una falla.
   *
   * La orden ya está creada cuando esto corre: perder el formulario entero
   * porque una foto no subió sería peor que avisar cuál quedó pendiente.
   */
  async subirVarias(
    ordenId: number,
    archivos: File[],
    pagoId: number | null = null
  ): Promise<{ subidos: Comprobante[]; fallidos: { nombre: string; motivo: string }[] }> {
    const subidos: Comprobante[] = [];
    const fallidos: { nombre: string; motivo: string }[] = [];

    for (const original of archivos) {
      try {
        const archivo = await comprimirCaptura(original);
        const formulario = new FormData();
        formulario.append('archivo', archivo, archivo.name);
        if (pagoId !== null) formulario.append('pago_id', String(pagoId));

        const res = await this.api.subir<RespuestaItem<Comprobante>>(
          `/api/ordenes/${ordenId}/comprobantes`,
          formulario
        );
        subidos.push(res.data);
      } catch (error) {
        fallidos.push({
          nombre: original.name,
          motivo: (error as { error?: { detail?: string } })?.error?.detail
            ?? 'No se pudo subir la captura.',
        });
      }
    }

    return { subidos, fallidos };
  }

  async borrar(id: number): Promise<void> {
    await this.api.delete(`/api/comprobantes/${id}`);
  }

  /**
   * URL con la que el navegador pide la captura.
   *
   * El backend devuelve una ruta relativa a propósito: así la misma fila sirve
   * cuando las imágenes cambien de almacén. Lo único que se añade aquí es el
   * host de la API, que en producción es el mismo origen.
   */
  urlDe(comprobante: Comprobante): string {
    return `${environment.apiUrl}${comprobante.url}`;
  }

  /** Formato y peso final del archivo guardado, para mostrarlo en pantalla. */
  resumen(comprobante: Comprobante): string {
    const formato = ETIQUETA_FORMATO[comprobante.tipo_mime] ?? comprobante.tipo_mime;
    return `${formato} · ${pesoLegible(comprobante.tamano_bytes)}`;
  }
}
