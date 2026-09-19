import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatosUsuario, UsuariosService } from '../../core/services/usuarios.service';
import { SesionService } from '../../core/services/sesion.service';
import { ETIQUETA_ROL, ROLES, Rol, UsuarioSistema } from '../../core/models';
import { mensajeDeError } from '../../shared/utilidades/errores';

function formularioVacio(): DatosUsuario {
  return { nombre: '', email: '', password: '', rol: 'operario' };
}

/**
 * Gestión de cuentas del sistema (solo administrador).
 *
 * Las cuentas se crean a mano: no existe registro abierto (decisión del SRS).
 */
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
})
export class UsuariosComponent {
  private usuariosService = inject(UsuariosService);
  sesion = inject(SesionService);

  readonly usuarios = signal<UsuarioSistema[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);

  readonly mostrarFormulario = signal(false);
  readonly form = signal<DatosUsuario>(formularioVacio());
  readonly errores = signal<Record<string, string>>({});

  readonly roles = ROLES;
  readonly etiquetaRol = ETIQUETA_ROL;

  constructor() {
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    try {
      this.usuarios.set(await this.usuariosService.listar());
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cargar la lista de usuarios.'));
    } finally {
      this.cargando.set(false);
    }
  }

  alternarFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.form.set(formularioVacio());
      this.errores.set({});
    }
  }

  actualizar<K extends keyof DatosUsuario>(campo: K, valor: DatosUsuario[K]): void {
    this.form.update(f => ({ ...f, [campo]: valor }));
    if (this.errores()[campo]) this.errores.update(e => ({ ...e, [campo]: '' }));
  }

  private validar(f: DatosUsuario): Record<string, string> {
    const errores: Record<string, string> = {};
    if (!f.nombre.trim()) errores['nombre'] = 'El nombre es requerido.';
    if (!f.email.trim() || !f.email.includes('@')) errores['email'] = 'Ingresa un correo válido.';
    if (!f.password || f.password.length < 8) {
      errores['password'] = 'La contraseña debe tener al menos 8 caracteres.';
    }
    return errores;
  }

  async guardar(): Promise<void> {
    const f = this.form();
    const errores = this.validar(f);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    this.guardando.set(true);
    try {
      await this.usuariosService.crear({
        nombre: f.nombre.trim(),
        email: f.email.trim().toLowerCase(),
        password: f.password,
        rol: f.rol,
      });
      this.alternarFormulario();
      await this.cargar();
      await this.sesion.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al crear el usuario.'));
    } finally {
      this.guardando.set(false);
    }
  }

  /** Activa o desactiva una cuenta (al desactivar se revocan sus sesiones). */
  async alternarActivo(usuario: UsuarioSistema): Promise<void> {
    const accion = usuario.activo ? 'desactivar' : 'reactivar';
    const confirmado = confirm(`¿Quieres ${accion} la cuenta de ${usuario.nombre}?`);
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.usuariosService.actualizar(usuario.id, { activo: !usuario.activo });
      await this.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo actualizar la cuenta.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async cambiarRol(usuario: UsuarioSistema, valor: string): Promise<void> {
    const rol = valor as Rol;
    if (rol === usuario.rol) return;

    this.guardando.set(true);
    try {
      await this.usuariosService.actualizar(usuario.id, { rol });
      await this.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cambiar el rol.'));
      await this.cargar();
    } finally {
      this.guardando.set(false);
    }
  }
}
