import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuditoriaService } from '../../core/services/auditoria.service';
import { ETIQUETA_ACCION } from '../../core/models';
import { formatearFecha } from '../../shared/utilidades/fechas';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

/** Historial de acciones. Solo lectura: las entradas nunca se editan ni borran. */
@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './auditoria.html',
})
export class AuditoriaComponent {
  private auditoriaService = inject(AuditoriaService);

  readonly entradas = this.auditoriaService.entradas;
  readonly total = this.auditoriaService.total;
  readonly cargando = this.auditoriaService.cargando;
  readonly cargandoMas = this.auditoriaService.cargandoMas;
  readonly hayMas = this.auditoriaService.hayMas;
  readonly hayFiltros = this.auditoriaService.hayFiltros;
  readonly sinPermiso = this.auditoriaService.sinPermiso;

  /** Filtros aplicados en el servidor (el historial ya no se recorta en 100). */
  readonly filtros = this.auditoriaService.filtros;

  readonly formatearFecha = formatearFecha;
  readonly etiquetaAccion = ETIQUETA_ACCION;

  /** Acciones disponibles en el filtro, con su etiqueta legible. */
  readonly opcionesAccion = Object.entries(ETIQUETA_ACCION).map(([valor, etiqueta]) => ({
    valor,
    etiqueta,
  }));

  constructor() {
    this.cargar();
  }

  cargar(): Promise<void> {
    return this.auditoriaService.cargar();
  }

  /** Trae el siguiente bloque de registros. */
  cargarMas(): void {
    void this.auditoriaService.cargarMas();
  }

  filtrarPorAccion(valor: string): void {
    void this.auditoriaService.filtrar({ accion: valor });
  }

  filtrarPorDesde(valor: string): void {
    void this.auditoriaService.filtrar({ desde: valor });
  }

  filtrarPorHasta(valor: string): void {
    void this.auditoriaService.filtrar({ hasta: valor });
  }

  limpiarFiltros(): void {
    void this.auditoriaService.limpiarFiltros();
  }

  /** Etiqueta legible de la acción; si no está mapeada, se muestra tal cual. */
  etiquetaDeAccion(accion: string): string {
    return ETIQUETA_ACCION[accion] || accion;
  }
}
