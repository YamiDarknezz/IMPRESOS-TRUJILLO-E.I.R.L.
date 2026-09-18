import { signal } from '@angular/core';
import { ApiService } from './api.service';
import { RespuestaLista } from '../models';

/**
 * Lista de datos traída del servidor, con caché y estado compartido.
 *
 * Varias pantallas necesitan los mismos catálogos (el formulario de orden usa
 * inventario y clientes; productos usa inventario; finanzas usa usuarios). Sin
 * caché, cada una repetiría la misma llamada al abrirse.
 *
 * `enVuelo` cubre el otro caso: si dos componentes piden cargar a la vez, se
 * hace una sola petición y ambos esperan la misma promesa.
 */
export class ListaRemota<T> {
  readonly items = signal<T[]>([]);
  readonly cargando = signal(false);

  private cargado = false;
  private enVuelo: Promise<void> | null = null;

  constructor(
    private readonly api: ApiService,
    private readonly ruta: string,
  ) {}

  /** Carga desde el servidor. Si ya hay datos, no repite la llamada. */
  async cargar(forzar = false): Promise<void> {
    if (this.cargado && !forzar) return;
    if (this.enVuelo) return this.enVuelo;

    this.enVuelo = this.pedir();
    try {
      await this.enVuelo;
    } finally {
      this.enVuelo = null;
    }
  }

  /** Vuelve a pedir los datos aunque ya estén en caché (tras crear o editar). */
  recargar(): Promise<void> {
    return this.cargar(true);
  }

  private async pedir(): Promise<void> {
    this.cargando.set(true);
    try {
      const res = await this.api.get<RespuestaLista<T>>(this.ruta);
      this.items.set(res.data ?? []);
      this.cargado = true;
    } finally {
      this.cargando.set(false);
    }
  }
}
