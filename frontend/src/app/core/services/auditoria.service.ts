import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { EntradaAuditoria, RespuestaLista } from '../models';

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private api = inject(ApiService);

  readonly entradas = signal<EntradaAuditoria[]>([]);
  readonly cargando = signal(false);
  /** El backend responde 403 a quien no es administrador: es su permiso. */
  readonly sinPermiso = signal(false);

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.sinPermiso.set(false);
    try {
      const res = await this.api.get<RespuestaLista<EntradaAuditoria>>('/api/auditoria');
      this.entradas.set(res.data ?? []);
    } catch (error) {
      const estado = (error as { status?: number })?.status;
      if (estado === 401 || estado === 403) {
        this.sinPermiso.set(true);
      } else {
        throw error;
      }
    } finally {
      this.cargando.set(false);
    }
  }
}
