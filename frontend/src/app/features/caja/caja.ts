import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CajaService } from '../../core/services/caja.service';
import { SesionService } from '../../core/services/sesion.service';
import {
  AcumuladoCaja,
  CierreCaja,
  ETIQUETA_METODO,
  ETIQUETA_UNIDAD,
  MetodoPago,
  ResumenCaja,
  UNIDADES_NEGOCIO,
  UnidadNegocio,
} from '../../core/models';
import { formatearFecha, hoyISO } from '../../shared/utilidades/fechas';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

/**
 * Cierre y arqueo diario de caja dual (RF-12 a RF-14).
 *
 * Cada usuario liquida lo que cobró por unidad de negocio y método de pago;
 * la Gerencia valida y congela el cierre del día.
 */
@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './caja.html',
})
export class CajaComponent {
  private cajaService = inject(CajaService);
  sesion = inject(SesionService);

  readonly fecha = signal(hoyISO());
  readonly unidad = signal<UnidadNegocio | null>(null);

  readonly resumen = signal<ResumenCaja | null>(null);
  readonly cierres = signal<CierreCaja[]>([]);
  readonly cargando = signal(false);
  readonly guardando = signal(false);

  readonly unidades = UNIDADES_NEGOCIO;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  readonly etiquetaMetodo = ETIQUETA_METODO;
  readonly metodos: MetodoPago[] = ['efectivo', 'yape', 'transferencia'];
  readonly formatearFecha = formatearFecha;

  constructor() {
    this.cargar();
  }

  cambiarFecha(valor: string): void {
    this.fecha.set(valor);
    this.cargar();
  }

  cambiarUnidad(valor: string): void {
    this.unidad.set(valor ? (valor as UnidadNegocio) : null);
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    try {
      const [resumen, cierres] = await Promise.all([
        this.cajaService.resumen(this.fecha(), this.unidad() ?? ''),
        this.cajaService.listarCierres(this.fecha(), this.unidad() ?? ''),
      ]);
      this.resumen.set(resumen);
      this.cierres.set(cierres);
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cargar la caja.'));
    } finally {
      this.cargando.set(false);
    }
  }

  /** Cada usuario cierra su propia caja; el backend toma sus cobros reales. */
  async cerrarCaja(unidad: UnidadNegocio): Promise<void> {
    const confirmado = confirm(
      `¿Cerrar tu caja de ${ETIQUETA_UNIDAD[unidad]} del ${this.fecha()}?\n\n` +
      'Se registrará el arqueo con los cobros que registraste ese día.'
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.cajaService.cerrar(this.fecha(), unidad);
      await this.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cerrar la caja.'));
    } finally {
      this.guardando.set(false);
    }
  }

  /** Solo la supervisión congela (valida) el cierre del día. */
  async congelar(cierre: CierreCaja): Promise<void> {
    const confirmado = confirm(
      `¿Congelar el cierre de ${cierre.usuario} (${ETIQUETA_UNIDAD[cierre.unidad_negocio]})?\n\n` +
      'Un cierre congelado ya no se puede modificar.'
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.cajaService.congelar(cierre.id);
      await this.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo congelar el cierre.'));
    } finally {
      this.guardando.set(false);
    }
  }

  montoDe(acumulado: AcumuladoCaja, metodo: MetodoPago): number {
    return acumulado[metodo] ?? 0;
  }

  /** Etiqueta legible del método; si viene uno desconocido, se muestra tal cual. */
  etiquetaDeMetodo(metodo: string): string {
    return ETIQUETA_METODO[metodo as MetodoPago] || metodo;
  }
}
