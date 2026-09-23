import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ListaRemota } from './lista-remota';
import {
  ConsumoPieza,
  ConsumoPiezaCreateData,
  MaterialInventario,
  MovimientoStock,
  PiezaLoteCreateData,
  PiezaLoteMaterial,
  RespuestaItem,
  RespuestaLista,
  TipoFormatoMaterial,
} from '../models';

/** Datos de la ficha de un material (el stock se ajusta aparte). */
export interface DatosMaterial {
  nombre: string;
  unidad_id: number;
  alerta_minima: number;
  dias_reabastecimiento: number;
  precio_compra?: number;
  ubicacion_estante?: string;
  tipo_formato?: TipoFormatoMaterial;
  ancho_predeterminado_m?: number | null;
  largo_predeterminado_m?: number | null;
  espesor_mm?: number | null;
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

  // ── Gestión de Rollos y Planchas Pre-dimensionadas ───────────────────────

  async listarPiezas(materialId?: number, estado?: string): Promise<PiezaLoteMaterial[]> {
    const params = new URLSearchParams();
    if (materialId) params.set('material_id', materialId.toString());
    if (estado) params.set('estado', estado);
    const query = params.toString();
    const res = await this.api.get<RespuestaLista<PiezaLoteMaterial>>(
      `/api/inventario/piezas${query ? `?${query}` : ''}`
    );
    return res.data ?? [];
  }

  async obtenerPieza(piezaId: number): Promise<PiezaLoteMaterial> {
    const res = await this.api.get<RespuestaItem<PiezaLoteMaterial>>(
      `/api/inventario/piezas/${piezaId}`
    );
    return res.data;
  }

  async registrarPieza(data: PiezaLoteCreateData): Promise<PiezaLoteMaterial> {
    const res = await this.api.post<RespuestaItem<PiezaLoteMaterial>>(
      '/api/inventario/piezas',
      data
    );
    return res.data;
  }

  async registrarConsumoPieza(
    piezaId: number,
    data: ConsumoPiezaCreateData
  ): Promise<ConsumoPieza> {
    const res = await this.api.post<RespuestaItem<ConsumoPieza>>(
      `/api/inventario/piezas/${piezaId}/consumos`,
      data
    );
    return res.data;
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
