import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { EntradaAuditoria, RespuestaLista } from '../models';

/** Filtros que el endpoint de auditoría ya sabe aplicar. */
export interface FiltrosAuditoria {
  accion: string;
  usuarioId: number | null;
  desde: string;
  hasta: string;
}

const SIN_FILTROS: FiltrosAuditoria = { accion: '', usuarioId: null, desde: '', hasta: '' };
const TAMANO_BLOQUE = 100;

@Injectable({ providedIn: 'root' })
export class AuditoriaService {
  private api = inject(ApiService);

  readonly entradas = signal<EntradaAuditoria[]>([]);
  /** Cuántos registros cumplen los filtros, según el servidor. */
  readonly total = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly cargandoMas = signal(false);
  /** El backend responde 403 a quien no es administrador: es su permiso. */
  readonly sinPermiso = signal(false);
  readonly filtros = signal<FiltrosAuditoria>({ ...SIN_FILTROS });

  readonly hayMas = computed(
    () => this.total() !== null && this.entradas().length < (this.total() ?? 0)
  );

  readonly hayFiltros = computed(() => {
    const f = this.filtros();
    return !!(f.accion || f.usuarioId !== null || f.desde || f.hasta);
  });

  /** Aplica filtros del servidor y vuelve al primer bloque. */
  filtrar(cambios: Partial<FiltrosAuditoria>): Promise<void> {
    this.filtros.update(actuales => ({ ...actuales, ...cambios }));
    return this.cargar();
  }

  limpiarFiltros(): Promise<void> {
    this.filtros.set({ ...SIN_FILTROS });
    return this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.sinPermiso.set(false);
    try {
      const res = await this.pedir(0);
      this.entradas.set(res.data ?? []);
      this.total.set(res.total ?? null);
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

  /**
   * Trae el siguiente bloque y lo agrega al final.
   *
   * El historial crecía sin límite y la pantalla pedía siempre los mismos 100
   * registros más recientes, sin forma de ver los anteriores (#28).
   */
  async cargarMas(): Promise<void> {
    if (!this.hayMas() || this.cargandoMas()) return;

    this.cargandoMas.set(true);
    try {
      const res = await this.pedir(this.entradas().length);
      this.entradas.update(actuales => [...actuales, ...(res.data ?? [])]);
      if (res.total !== undefined && res.total !== null) this.total.set(res.total);
    } finally {
      this.cargandoMas.set(false);
    }
  }

  private pedir(desplazamiento: number): Promise<RespuestaLista<EntradaAuditoria>> {
    return this.api.get<RespuestaLista<EntradaAuditoria>>(
      `/api/auditoria?${this.consulta(desplazamiento)}`
    );
  }

  private consulta(desplazamiento: number): string {
    const f = this.filtros();
    const partes = [`limit=${TAMANO_BLOQUE}`, `offset=${desplazamiento}`];
    if (f.accion) partes.push(`accion=${encodeURIComponent(f.accion)}`);
    if (f.usuarioId !== null) partes.push(`usuario_id=${f.usuarioId}`);
    if (f.desde) partes.push(`desde=${f.desde}`);
    if (f.hasta) partes.push(`hasta=${f.hasta}`);
    return partes.join('&');
  }
}
