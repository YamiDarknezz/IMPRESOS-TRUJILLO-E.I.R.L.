import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UnidadesService } from '../../core/services/unidades.service';
import { Unidad } from '../../core/models';
import { mensajeDeError } from '../../shared/utilidades/errores';

/**
 * Catálogo de unidades de medida.
 *
 * Es un catálogo cerrado a propósito: cuando la unidad se escribía a mano, un
 * material terminó guardado con la unidad "10000" por un error de tipeo.
 */
@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './unidades.html',
})
export class UnidadesComponent {
  private unidadesService = inject(UnidadesService);

  readonly unidades = this.unidadesService.unidades;

  readonly nombre = signal('');
  readonly abreviatura = signal('');
  readonly error = signal('');
  readonly guardando = signal(false);

  constructor() {
    this.unidadesService.cargar();
  }

  async guardar(): Promise<void> {
    if (!this.nombre().trim()) {
      this.error.set('El nombre es requerido.');
      return;
    }

    this.guardando.set(true);
    try {
      await this.unidadesService.crear(this.nombre().trim(), this.abreviatura().trim());
      this.nombre.set('');
      this.abreviatura.set('');
      this.error.set('');
    } catch (e) {
      alert(mensajeDeError(e, 'Error al crear la unidad.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(unidad: Unidad): Promise<void> {
    const confirmado = confirm(
      `¿Eliminar la unidad "${unidad.nombre}"?\n\n` +
      'Los materiales que ya la usan no se modifican.'
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.unidadesService.eliminar(unidad.id);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al eliminar la unidad.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
