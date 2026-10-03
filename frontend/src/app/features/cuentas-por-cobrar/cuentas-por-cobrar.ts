import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FinanzasService } from '../../core/services/finanzas.service';
import { CuentasPorCobrar, TramosAntiguedad } from '../../core/models';
import { descargarCSV } from '../../shared/utilidades/csv';
import { formatearFecha } from '../../shared/utilidades/fechas';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

/** Los tramos, en orden, con su nombre en pantalla. */
export const TRAMOS: { clave: keyof TramosAntiguedad; etiqueta: string }[] = [
  { clave: 'd0_30', etiqueta: '0 a 30 días' },
  { clave: 'd31_60', etiqueta: '31 a 60 días' },
  { clave: 'd61_90', etiqueta: '61 a 90 días' },
  { clave: 'd90_mas', etiqueta: 'Más de 90 días' },
];

/**
 * Cuentas por cobrar (#72): lo que debe cada cliente y desde hace cuánto.
 *
 * Es el seguimiento de las entregas autorizadas antes de pagar a los clientes
 * proformas (clientes de confianza o que pagan a plazo): sin esta vista la deuda se llevaba por fuera y se perdía la
 * trazabilidad. Solo la ve la supervisión.
 */
@Component({
  selector: 'app-cuentas-por-cobrar',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './cuentas-por-cobrar.html',
})
export class CuentasPorCobrarComponent {
  private finanzas = inject(FinanzasService);

  readonly datos = signal<CuentasPorCobrar | null>(null);
  readonly cargando = signal(false);
  readonly soloProformas = signal(true);
  /** Clientes con el detalle de órdenes desplegado. */
  readonly abiertos = signal<ReadonlySet<number>>(new Set());

  readonly tramos = TRAMOS;
  readonly formatearFecha = formatearFecha;

  constructor() {
    void this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    try {
      this.datos.set(await this.finanzas.cuentasPorCobrar(this.soloProformas()));
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudieron cargar las cuentas por cobrar.'));
    } finally {
      this.cargando.set(false);
    }
  }

  cambiarAlcance(soloProformas: boolean): void {
    this.soloProformas.set(soloProformas);
    void this.cargar();
  }

  alternar(idCliente: number): void {
    this.abiertos.update(actuales => {
      const nuevos = new Set(actuales);
      if (nuevos.has(idCliente)) nuevos.delete(idCliente);
      else nuevos.add(idCliente);
      return nuevos;
    });
  }

  /** Descarga el detalle (una fila por orden) para Excel. */
  exportarCSV(): void {
    const datos = this.datos();
    if (!datos) return;

    const filas: unknown[][] = [
      ['Cuentas por cobrar — Impresos Trujillo'],
      ['Fecha de corte', datos.fecha_corte],
      ['Alcance', datos.solo_proformas ? 'Solo proformas' : 'Proformas y contratos'],
      ['Total pendiente (S/)', datos.total_pendiente.toFixed(2)],
      [],
      ['Cliente', 'Orden', 'Estado', 'Total (S/)', 'Saldo (S/)', 'Desde', 'Días', 'Tramo', 'Autorizó', 'Motivo'],
    ];
    for (const cliente of datos.clientes) {
      for (const orden of cliente.ordenes) {
        filas.push([
          cliente.cliente,
          orden.codigo,
          orden.estado,
          orden.total.toFixed(2),
          orden.saldo_pendiente.toFixed(2),
          orden.fecha_referencia,
          orden.dias,
          TRAMOS.find(t => t.clave === orden.tramo)?.etiqueta ?? orden.tramo,
          orden.entrega_autorizada_por ?? '',
          orden.entrega_motivo,
        ]);
      }
    }
    descargarCSV(`cuentas-por-cobrar-${datos.fecha_corte}.csv`, filas);
  }
}
