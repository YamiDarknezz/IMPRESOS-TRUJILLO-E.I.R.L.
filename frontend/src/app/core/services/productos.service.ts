import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ListaRemota } from './lista-remota';
import { MaterialItem, Producto, TipoProducto } from '../models';

export interface DatosProducto {
  nombre: string;
  tipo: TipoProducto;
  precio_base: number;
  notas: string;
  /** Receta en la forma que usa el formulario (con nombre del material). */
  materiales: MaterialItem[];
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private api = inject(ApiService);
  private lista = new ListaRemota<Producto>(this.api, '/api/productos');

  readonly productos = this.lista.items;
  readonly cargando = this.lista.cargando;

  cargar = (forzar = false) => this.lista.cargar(forzar);
  recargar = () => this.lista.recargar();

  async crear(datos: DatosProducto): Promise<void> {
    await this.api.post('/api/productos', this.conRecetaValida(datos));
    await this.lista.recargar();
  }

  async actualizar(id: number, datos: DatosProducto): Promise<void> {
    await this.api.patch(`/api/productos/${id}`, this.conRecetaValida(datos));
    await this.lista.recargar();
  }

  async desactivar(id: number): Promise<void> {
    await this.api.delete(`/api/productos/${id}`);
    await this.lista.recargar();
  }

  /**
   * La receta de materiales solo tiene sentido en un producto propio, y el
   * backend la espera como {material_id, cantidad}.
   */
  private conRecetaValida(datos: DatosProducto) {
    return {
      nombre: datos.nombre,
      tipo: datos.tipo,
      precio_base: datos.precio_base,
      notas: datos.notas,
      receta:
        datos.tipo === 'propio'
          ? datos.materiales.map(m => ({ material_id: m.id_material, cantidad: m.cantidad }))
          : [],
    };
  }
}
