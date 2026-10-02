import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ListaRemota } from './lista-remota';
import { Unidad } from '../models';

@Injectable({ providedIn: 'root' })
export class UnidadesService {
  private api = inject(ApiService);

  /**
   * Solo las activas: es lo que ofrecen los formularios que eligen unidad
   * (registrar un material no debe proponer una unidad desactivada, #58).
   */
  private lista = new ListaRemota<Unidad>(this.api, '/api/unidades');

  /** Todas, incluidas las desactivadas: el catálogo las muestra atenuadas. */
  private listaCompleta = new ListaRemota<Unidad>(this.api, '/api/unidades?incluir_inactivas=true');

  readonly unidades = this.lista.items;
  readonly todas = this.listaCompleta.items;
  readonly cargando = this.lista.cargando;

  cargar = (forzar = false) => this.lista.cargar(forzar);
  cargarTodas = (forzar = false) => this.listaCompleta.cargar(forzar);
  recargar = () => this.lista.recargar();
  recargarTodas = () => this.listaCompleta.recargar();

  /** ¿Este nombre de unidad existe ya en el catálogo (activa o desactivada)? */
  existe(nombre: string): boolean {
    return [...this.unidades(), ...this.todas()].some(u => u.nombre === nombre);
  }

  async crear(nombre: string, abreviatura: string): Promise<void> {
    await this.api.post('/api/unidades', { nombre, abreviatura });
    await this.refrescarTodo();
  }

  async actualizar(id: number, nombre: string, abreviatura: string): Promise<void> {
    await this.api.patch(`/api/unidades/${id}`, { nombre, abreviatura });
    await this.refrescarTodo();
  }

  async eliminar(id: number): Promise<void> {
    await this.api.delete(`/api/unidades/${id}`);
    await this.refrescarTodo();
  }

  /** Las dos vistas del mismo catálogo se refrescan juntas o quedan desfasadas. */
  private async refrescarTodo(): Promise<void> {
    await Promise.all([this.lista.recargar(), this.listaCompleta.recargar()]);
  }
}
