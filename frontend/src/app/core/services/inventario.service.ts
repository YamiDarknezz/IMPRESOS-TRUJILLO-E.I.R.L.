import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ListaRemota } from './lista-remota';
import { MaterialInventario, MovimientoStock, RespuestaLista } from '../models';

/** Datos de la ficha de un material (el stock se ajusta aparte). */
export interface DatosMaterial {
  nombre: string;
  unidad_id: number;
  alerta_minima: number;
  dias_reabastecimiento: number;
}

@Injectable({ providedIn: 'root' })
export class InventarioService {
  private api = inject(ApiService);
  private lista = new ListaRemota<MaterialInventario>(this.api, '/api/inventario');

  readonly materiales = this.lista.items;
  readonly cargando = this.lista.cargando;

  cargar = (forzar = false) => this.lista.cargar(forzar);
  recargar = () => this.lista.recargar();

  async crear(datos: DatosMaterial & { stock_inicial: number }): Promise<void> {
    await this.api.post('/api/inventario', datos);
    await this.lista.recargar();
  }

  /**
   * Guarda la ficha y, solo si cambió, ajusta el stock.
   *
   * Son dos endpoints distintos a propósito: editar la ficha es rutina, pero
   * corregir el stock a mano queda registrado aparte en la auditoría.
   */
  async actualizar(
    id: number,
    datos: DatosMaterial,
    stockActual?: number,
    stockAnterior?: number,
  ): Promise<void> {
    await this.api.patch(`/api/inventario/${id}`, datos);

    if (stockActual !== undefined && stockActual !== stockAnterior) {
      await this.api.patch(`/api/inventario/${id}/stock`, {
        stock_actual: stockActual,
        nota: 'Corrección manual desde el panel',
      });
    }
    await this.lista.recargar();
  }

  /** Trazabilidad del material: reservas, mermas, devoluciones y ajustes. */
  async listarMovimientos(id: number): Promise<MovimientoStock[]> {
    const res = await this.api.get<RespuestaLista<MovimientoStock>>(
      `/api/inventario/${id}/movimientos`
    );
    return res.data ?? [];
  }
}

/** ¿El material está por debajo de su alerta mínima? */
export function tieneStockBajo(material: MaterialInventario): boolean {
  return material.stock_bajo ?? material.stock_actual <= material.alerta_minima;
}

export function filtrarMateriales(
  materiales: MaterialInventario[],
  texto: string,
): MaterialInventario[] {
  const termino = texto.toLowerCase().trim();
  if (!termino) return materiales;
  return materiales.filter(m => m.nombre?.toLowerCase().includes(termino));
}
