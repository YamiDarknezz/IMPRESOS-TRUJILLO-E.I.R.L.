import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditoriaService } from '../../core/services/auditoria.service';
import { ETIQUETA_ACCION } from '../../core/models';
import { formatearFecha } from '../../shared/utilidades/fechas';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

/** Historial de acciones. Solo lectura: las entradas nunca se editan ni borran. */
@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './auditoria.html',
})
export class AuditoriaComponent {
  private auditoriaService = inject(AuditoriaService);

  readonly entradas = this.auditoriaService.entradas;
  readonly cargando = this.auditoriaService.cargando;
  readonly sinPermiso = this.auditoriaService.sinPermiso;

  readonly formatearFecha = formatearFecha;
  readonly etiquetaAccion = ETIQUETA_ACCION;

  constructor() {
    this.cargar();
  }

  cargar(): Promise<void> {
    return this.auditoriaService.cargar();
  }

  /** Etiqueta legible de la acción; si no está mapeada, se muestra tal cual. */
  etiquetaDeAccion(accion: string): string {
    return ETIQUETA_ACCION[accion] || accion;
  }
}
