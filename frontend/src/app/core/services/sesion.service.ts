import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { guardarUsuario, leerUsuarioGuardado } from './sesion-almacen';
import { RespuestaItem, RespuestaLista, UsuarioSistema } from '../models';

/**
 * Quién está usando el sistema y qué puede hacer.
 *
 * Lo consultan casi todas las pantallas, así que se carga una sola vez al
 * entrar. Las comprobaciones de rol de aquí son para MOSTRAR u ocultar
 * controles: el permiso real lo aplica el backend en cada petición.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private api = inject(ApiService);

  readonly usuario = signal<UsuarioSistema | null>(leerUsuarioGuardado());
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

  private cargado = false;

  async cargar(): Promise<void> {
    if (this.cargado) return;
    this.cargado = true;

    try {
      const res = await this.api.get<RespuestaItem<UsuarioSistema>>('/api/auth/me');
      this.usuario.set(res.data);
      guardarUsuario(res.data);
    } catch {
      // Sin perfil válido la interfaz queda deshabilitada; al siguiente 401
      // el ApiService limpia la sesión y vuelve al login.
      return;
    }

    if (this.esSupervisor()) await this.cargarUsuarios();
  }

  /** Tras iniciar o cerrar sesión, se vuelve a pedir todo. */
  reiniciar(): void {
    this.cargado = false;
    this.usuario.set(leerUsuarioGuardado());
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
