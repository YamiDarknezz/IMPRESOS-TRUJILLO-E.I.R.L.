import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FinanzasService } from '../../core/services/finanzas.service';
import { SesionService, nombreVisible } from '../../core/services/sesion.service';
import { ETIQUETA_UNIDAD, UNIDADES_NEGOCIO } from '../../core/models';
import { descargarCSV } from '../../shared/utilidades/csv';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

@Component({
  selector: 'app-finanzas',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './finanzas.html',
})
export class FinanzasComponent {
  private finanzasService = inject(FinanzasService);
  sesion = inject(SesionService);

  readonly resumen = this.finanzasService.resumen;
  readonly cargando = this.finanzasService.cargando;
  readonly porMetodo = this.finanzasService.porMetodo;

  readonly desde = this.finanzasService.desde;
  readonly hasta = this.finanzasService.hasta;
  readonly trabajador = this.finanzasService.trabajador;

  readonly nombreVisible = nombreVisible;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  readonly unidadesNegocio = UNIDADES_NEGOCIO;

  constructor() {
    this.cargar();
  }

  async cargar(): Promise<void> {
    try {
      await this.finanzasService.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cargar el resumen de finanzas.'));
    }
  }

  /** Cambia el trabajador filtrado (el select manda número o null). */
  cambiarTrabajador(valor: number | null): void {
    this.trabajador.set(valor);
    this.cargar();
  }

  filtrarMesActual(): void {
    this.finanzasService.setMesActual();
  }

  filtrarHoy(): void {
    this.finanzasService.setHoy();
  }

  filtrarTodo(): void {
    this.finanzasService.setTodo();
  }

  /** Exporta el resumen tal como se ve, para pasárselo al contador. */
  exportarCSV(): void {
    const datos = this.resumen();
    if (!datos) return;

    const nombreTrabajador = this.trabajador()
      ? this.sesion.nombreDe(this.trabajador()) || String(this.trabajador())
      : 'Todos';

    const filas: unknown[][] = [
      ['Reporte de Finanzas — Impresos Trujillo'],
      ['Rango', `${this.desde() || '—'} a ${this.hasta() || '—'}`],
      ['Trabajador', nombreTrabajador],
      [],
      ['Resumen'],
      ['Concepto', 'Monto (S/)'],
      ['Ingresos recibidos', datos.total_ingresos.toFixed(2)],
      ['Total contratos', datos.total_contratos.toFixed(2)],
      ['Adelantos', datos.total_adelantos.toFixed(2)],
      ['Por cobrar', datos.total_por_cobrar.toFixed(2)],
      ['Total órdenes', datos.total_ordenes],
      [],
      ['Ingresos por método de pago'],
      ['Método', 'Monto (S/)'],
      ...this.porMetodo().map(m => [m.metodo, m.monto.toFixed(2)]),
      [],
      ['Desglose por unidad de negocio'],
      ['Unidad', 'Contratos (S/)', 'Ingresos (S/)', 'Por cobrar (S/)'],
      ...UNIDADES_NEGOCIO.map(unidad => {
        const fila = datos.por_unidad_negocio[unidad];
        return [
          ETIQUETA_UNIDAD[unidad],
          (fila?.contratos ?? 0).toFixed(2),
          (fila?.ingresos ?? 0).toFixed(2),
          (fila?.por_cobrar ?? 0).toFixed(2),
        ];
      }),
    ];

    if (datos.es_supervisor && datos.por_trabajador.length > 0) {
      filas.push(
        [],
        ['Generado por trabajador'],
        ['Trabajador', 'Órdenes', 'Contratos (S/)', 'Ingresos (S/)', 'Por cobrar (S/)'],
        ...datos.por_trabajador.map(t => [
          t.nombre, t.ordenes,
          t.contratos.toFixed(2), t.ingresos.toFixed(2), t.por_cobrar.toFixed(2),
        ]),
      );
    }

    descargarCSV(
      `finanzas_${this.desde() || 'inicio'}_a_${this.hasta() || 'hoy'}.csv`,
      filas,
    );
  }
}
