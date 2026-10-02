import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { RespuestaItem, RespuestaLista, UsuarioSistema } from '../models';

/**
 * Quién está usando el sistema y qué puede hacer.
 *
 * El perfil —y con él el rol— sale SIEMPRE del servidor (`/api/auth/me`). Antes
 * el rol se leía de un JSON guardado en el navegador, así que editarlo a mano
 * en la consola abría las pantallas de administración (#48). Ahora no hay nada
 * que editar: el navegador solo tiene una cookie HttpOnly que no puede leer.
 *
 * Las comprobaciones de rol de aquí son para MOSTRAR u ocultar controles: el
 * permiso real lo aplica el backend en cada petición.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private api = inject(ApiService);

  readonly usuario = signal<UsuarioSistema | null>(null);
  /** Lista de usuarios; la pueden leer administrador y subgerencia. */
  readonly usuarios = signal<UsuarioSistema[]>([]);

  readonly esAdmin = computed(() => this.usuario()?.rol === 'admin');
  readonly esSupervisor = computed(() =>
    ['admin', 'subgerente'].includes(this.usuario()?.rol ?? '')
  );
  /** Roles que registran y editan órdenes y clientes (mostrador incluido). */
  readonly puedeGestionarOrdenes = computed(() =>
    ['admin', 'subgerente', 'secretaria'].includes(this.usuario()?.rol ?? '')
  );
  /** Espejo de `personal_venta` del backend: cobrar y cerrar caja (issue #23). */
  readonly puedeVender = computed(() =>
    ['admin', 'subgerente', 'secretaria', 'operario'].includes(this.usuario()?.rol ?? '')
  );

  private cargado = false;
  private enVuelo: Promise<void> | null = null;

  constructor() {
    // Si el servidor rechaza la sesión, el perfil en memoria deja de valer:
    // se limpia para que el próximo guard vuelva a preguntar.
    this.api.alExpirarSesion(() => this.reiniciar());
  }

  /**
   * Perfil del servidor. Es la única fuente del rol, así que los guards la
   * esperan antes de decidir. Varias llamadas simultáneas comparten la misma
   * petición.
   */
  cargar(): Promise<void> {
    if (this.cargado) return Promise.resolve();
    if (this.enVuelo) return this.enVuelo;

    this.enVuelo = this.pedirPerfil().finally(() => {
      this.enVuelo = null;
    });
    return this.enVuelo;
  }

  private async pedirPerfil(): Promise<void> {
    try {
      const res = await this.api.get<RespuestaItem<UsuarioSistema>>('/api/auth/me');
      this.usuario.set(res.data);
      this.cargado = true;
    } catch {
      // Sin perfil válido no hay sesión: el guard manda al login.
      this.usuario.set(null);
      this.cargado = false;
      return;
    }

    if (this.esSupervisor()) await this.cargarUsuarios();
  }

  /** Tras iniciar o cerrar sesión, se vuelve a pedir el perfil. */
  reiniciar(): void {
    this.cargado = false;
    this.enVuelo = null;
    this.usuario.set(null);
    this.usuarios.set([]);
  }

  private async cargarUsuarios(): Promise<void> {
    try {
      const res = await this.api.get<RespuestaLista<UsuarioSistema>>('/api/usuarios');
      this.usuarios.set(res.data ?? []);
    } catch {
      // Sin la lista, los selectores de asignación quedan vacíos pero el
      // resto de la pantalla sigue siendo utilizable.
    }
  }

  /** Nombre a mostrar, con respaldo para cuentas sin nombre configurado. */
  nombreDe(id: number | null | undefined): string {
    if (!id) return '';
    const encontrado = this.usuarios().find(u => u.id === id);
    return encontrado ? nombreVisible(encontrado) : '';
  }

  /** ¿Puede gestionar esta orden (reportar uso, cobrar)? */
  puedeGestionar(orden: { asignado_a?: number | null }): boolean {
    if (this.puedeGestionarOrdenes()) return true;
    return (orden.asignado_a ?? null) === (this.usuario()?.id ?? -1);
  }

  /** ¿Puede avanzar la etapa de producción de esta orden? */
  puedeAvanzarEtapa(orden: { asignado_a?: number | null }): boolean {
    if (this.esSupervisor()) return true;
    return (orden.asignado_a ?? null) === (this.usuario()?.id ?? -1);
  }
}

/** Evita filas en blanco cuando una cuenta quedó sin nombre. */
export function nombreVisible(usuario: UsuarioSistema): string {
  return usuario.nombre?.trim() || usuario.email || 'Sin nombre';
}
