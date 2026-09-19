import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ListaRemota } from './lista-remota';
import { Unidad } from '../models';

@Injectable({ providedIn: 'root' })
export class UnidadesService {
  private api = inject(ApiService);
  private lista = new ListaRemota<Unidad>(this.api, '/api/unidades');

  readonly unidades = this.lista.items;
  readonly cargando = this.lista.cargando;

  cargar = (forzar = false) => this.lista.cargar(forzar);
  recargar = () => this.lista.recargar();

  /** ¿Este nombre de unidad existe en el catálogo? */
  existe(nombre: string): boolean {
    return this.unidades().some(u => u.nombre === nombre);
  }

  async crear(nombre: string, abreviatura: string): Promise<void> {
    await this.api.post('/api/unidades', { nombre, abreviatura });
    await this.lista.recargar();
  }

  async actualizar(id: number, nombre: string, abreviatura: string): Promise<void> {
    await this.api.patch(`/api/unidades/${id}`, { nombre, abreviatura });
    await this.lista.recargar();
  }

  async eliminar(id: number): Promise<void> {
    await this.api.delete(`/api/unidades/${id}`);
    await this.lista.recargar();
  }
}
