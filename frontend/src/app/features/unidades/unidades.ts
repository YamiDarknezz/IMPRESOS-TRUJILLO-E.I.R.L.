import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UnidadesService } from '../../core/services/unidades.service';
import { Unidad } from '../../core/models';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

/**
 * Catálogo de unidades de medida.
 *
 * Es un catálogo cerrado a propósito: cuando la unidad se escribía a mano, un
 * material terminó guardado con la unidad "10000" por un error de tipeo.
 *
 * El borrado es lógico (los materiales que ya la usan siguen apuntando a la
 * unidad), así que la tabla muestra también las desactivadas —atenuadas y con
 * su etiqueta— y se pueden editar: antes, corregir una abreviatura mal escrita
 * obligaba a crear otra unidad y dejaba la anterior huérfana (#58).
 */
@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './unidades.html',
})
export class UnidadesComponent {
  private unidadesService = inject(UnidadesService);

  /** Incluye las desactivadas, que se muestran atenuadas. */
  readonly unidades = this.unidadesService.todas;

  readonly nombre = signal('');
  readonly abreviatura = signal('');
  readonly error = signal('');
  readonly guardando = signal(false);

  /** Unidad que se está editando en la fila (null = ninguna). */
  readonly editando = signal<Unidad | null>(null);
  readonly nombreEdicion = signal('');
  readonly abreviaturaEdicion = signal('');
  readonly errorEdicion = signal('');

  constructor() {
    this.unidadesService.cargarTodas();
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

  editar(unidad: Unidad): void {
    this.editando.set(unidad);
    this.nombreEdicion.set(unidad.nombre);
    this.abreviaturaEdicion.set(unidad.abreviatura ?? '');
    this.errorEdicion.set('');
  }

  cancelarEdicion(): void {
    this.editando.set(null);
    this.errorEdicion.set('');
  }

  async guardarEdicion(): Promise<void> {
    const unidad = this.editando();
    if (!unidad) return;

    if (!this.nombreEdicion().trim()) {
      this.errorEdicion.set('El nombre es requerido.');
      return;
    }

    this.guardando.set(true);
    try {
      await this.unidadesService.actualizar(
        unidad.id,
        this.nombreEdicion().trim(),
        this.abreviaturaEdicion().trim(),
      );
      this.editando.set(null);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al editar la unidad.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(unidad: Unidad): Promise<void> {
    const confirmado = confirm(
      `¿Desactivar la unidad "${unidad.nombre}"?\n\n` +
      'Dejará de ofrecerse al registrar materiales nuevos. Los materiales que ya la usan no se modifican.'
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.unidadesService.eliminar(unidad.id);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al desactivar la unidad.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
