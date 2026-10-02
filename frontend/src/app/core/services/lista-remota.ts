import { computed, signal } from '@angular/core';
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
 *
 * Con `tamanoBloque` la lista se pagina: se pide ese bloque y, si el endpoint
 * informa un total mayor, `hayMas` habilita traer el resto con `cargarMas()`
 * (#27/#28). Sin ese parámetro el comportamiento es el de siempre.
 */
export class ListaRemota<T> {
  readonly items = signal<T[]>([]);
  /** Total de registros que cumplen el filtro, si el endpoint lo informa. */
  readonly total = signal<number | null>(null);
  readonly cargando = signal(false);
  readonly cargandoMas = signal(false);

  /** ¿Quedan registros por traer? Solo con `tamanoBloque` y total conocido. */
  readonly hayMas = computed(
    () => this.total() !== null && this.items().length < (this.total() ?? 0)
  );

  private cargado = false;
  private enVuelo: Promise<void> | null = null;

  constructor(
    private readonly api: ApiService,
    private readonly ruta: string,
    private readonly tamanoBloque?: number,
  ) {}

  /** Carga desde el servidor. Si ya hay datos, no repite la llamada. */
  async cargar(forzar = false): Promise<void> {
    if (this.cargado && !forzar) return;
    if (this.enVuelo) return this.enVuelo;

    this.enVuelo = this.pedir(0, true);
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

  /** Trae el siguiente bloque y lo agrega al final (carga incremental). */
  async cargarMas(): Promise<void> {
    if (this.tamanoBloque === undefined || !this.hayMas() || this.cargandoMas()) return;

    this.cargandoMas.set(true);
    try {
      await this.pedir(this.items().length, false);
    } finally {
      this.cargandoMas.set(false);
    }
  }

  private async pedir(desplazamiento: number, reemplazar: boolean): Promise<void> {
    if (reemplazar) this.cargando.set(true);
    try {
      const res = await this.api.get<RespuestaLista<T>>(this.rutaConBloque(desplazamiento));
      if (res.total !== undefined && res.total !== null) this.total.set(res.total);

      const datos = res.data ?? [];
      if (reemplazar) {
        this.items.set(datos);
        this.cargado = true;
      } else {
        this.items.update(actuales => [...actuales, ...datos]);
      }
    } finally {
      if (reemplazar) this.cargando.set(false);
    }
  }

  private rutaConBloque(desplazamiento: number): string {
    if (this.tamanoBloque === undefined) return this.ruta;
    const separador = this.ruta.includes('?') ? '&' : '?';
    return `${this.ruta}${separador}limit=${this.tamanoBloque}&offset=${desplazamiento}`;
  }
}
