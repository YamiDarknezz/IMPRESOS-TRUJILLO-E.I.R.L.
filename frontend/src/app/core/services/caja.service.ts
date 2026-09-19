import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import {
  CierreCaja,
  RespuestaItem,
  RespuestaLista,
  ResumenCaja,
  UnidadNegocio,
} from '../models';

/**
 * Cierre y arqueo diario de caja dual (RF-12 a RF-14).
 *
 * Cada usuario liquida lo que cobró por unidad de negocio y método de pago;
 * la Gerencia valida y congela el cierre del día.
 */
@Injectable({ providedIn: 'root' })
export class CajaService {
  private api = inject(ApiService);

  async resumen(
    fecha: string,
    unidad?: UnidadNegocio | '',
  ): Promise<ResumenCaja> {
    const params = new URLSearchParams({ fecha });
    if (unidad) params.set('unidad_negocio', unidad);

    const res = await this.api.get<RespuestaItem<ResumenCaja>>(
      `/api/caja/resumen?${params.toString()}`
    );
    return res.data;
  }

  async listarCierres(fecha?: string, unidad?: UnidadNegocio | ''): Promise<CierreCaja[]> {
    const params = new URLSearchParams();
    if (fecha) params.set('fecha', fecha);
    if (unidad) params.set('unidad_negocio', unidad);

    const texto = params.toString();
    const res = await this.api.get<RespuestaLista<CierreCaja>>(
      `/api/caja${texto ? `?${texto}` : ''}`
    );
    return res.data ?? [];
  }

  async cerrar(
    fecha: string,
    unidad: UnidadNegocio,
    observacion = '',
  ): Promise<CierreCaja> {
    const res = await this.api.post<RespuestaItem<CierreCaja>>('/api/caja/cerrar', {
      fecha,
      unidad_negocio: unidad,
      observacion,
    });
    return res.data;
  }

  async congelar(id: number, observacion = ''): Promise<CierreCaja> {
    const res = await this.api.post<RespuestaItem<CierreCaja>>(
      `/api/caja/${id}/congelar`,
      { observacion }
    );
    return res.data;
  }
}
