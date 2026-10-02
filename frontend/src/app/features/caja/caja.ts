import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CajaService } from '../../core/services/caja.service';
import { SesionService } from '../../core/services/sesion.service';
import {
  AcumuladoCaja,
  CierreCaja,
  DetalleCaja,
  ETIQUETA_METODO,
  ETIQUETA_UNIDAD,
  ResumenCaja,
  UNIDADES_NEGOCIO,
  UnidadNegocio,
} from '../../core/models';
import { ayerISO, formatearFecha, hoyISO } from '../../shared/utilidades/fechas';
import { mensajeDeError } from '../../shared/utilidades/errores';
import {
  etiquetaDe,
  etiquetasMetodo,
  metodosPago,
  motivosObservacion,
} from '../../core/estado/catalogos';
import { IconComponent } from '../../shared/componentes/icon/icon.component';
import { ModalComponent } from '../../shared/componentes/modal/modal.component';

/**
 * Cierre y arqueo diario de caja dual (RF-12 a RF-14).
 *
 * Cada usuario liquida lo que cobró por unidad de negocio y método de pago;
 * la Gerencia valida y congela el cierre del día.
 * Se auditan y observan cobros fraudulentos o erróneos antes del arqueo.
 */
@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, ModalComponent],
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

  // ── Modal Observar Cobro (Auditoría previa al cierre) ───────────────────
  readonly pagoAObservar = signal<DetalleCaja | null>(null);
  readonly motivoObservacion = signal<string>('yape_falso');
  readonly notaObservacion = signal<string>('');

  readonly unidades = UNIDADES_NEGOCIO;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  readonly etiquetaMetodo = etiquetasMetodo;
  // Del servidor: antes estaba aquí copiada y había que mantenerla a mano.
  readonly metodos = metodosPago;
  readonly formatearFecha = formatearFecha;

  /** Los motivos de observación, con su nombre legible, vienen del catálogo. */
  readonly motivosObservacion = computed(() =>
    motivosObservacion().map(opcion => ({ id: opcion.valor, nombre: opcion.etiqueta }))
  );

  constructor() {
    this.cargar();
  }

  cambiarFecha(valor: string): void {
    this.fecha.set(valor);
    this.cargar();
  }

  esHoy(): boolean {
    return this.fecha() === hoyISO();
  }

  esAyer(): boolean {
    return this.fecha() === ayerISO();
  }

  irAHoy(): void {
    this.cambiarFecha(hoyISO());
  }

  irAAyer(): void {
    this.cambiarFecha(ayerISO());
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

  /**
   * Monto de un método en el acumulado del día.
   *
   * El método llega como texto desde el catálogo del servidor, así que se lee
   * de forma dinámica: si mañana se agrega uno (por ejemplo Plin), la columna
   * aparece en el arqueo y suma sola, sin tocar esta función ni la plantilla.
   */
  montoDe(acumulado: AcumuladoCaja, metodo: string): number {
    return (acumulado as unknown as Record<string, number>)[metodo] ?? 0;
  }

  /** Etiqueta legible del método; si viene uno desconocido, se muestra tal cual. */
  etiquetaDeMetodo(metodo: string): string {
    // La etiqueta sale del catálogo del servidor: si algún día se agrega un
    // método de pago, ya viene con su nombre.
    return etiquetaDe('metodos_pago', metodo);
  }

  // ── Acciones de Auditoría y Observación de Cobros ──────────────────────────

  abrirModalObservar(item: DetalleCaja): void {
    this.pagoAObservar.set(item);
    this.motivoObservacion.set('yape_falso');
    this.notaObservacion.set('');
  }

  cerrarModalObservar(): void {
    this.pagoAObservar.set(null);
  }

  async guardarObservacion(): Promise<void> {
    const pago = this.pagoAObservar();
    if (!pago || !pago.pago_id) return;

    this.guardando.set(true);
    try {
      await this.cajaService.observarPago(pago.pago_id, {
        motivo: this.motivoObservacion(),
        nota: this.notaObservacion(),
      });
      this.cerrarModalObservar();
      await this.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo registrar la observación del cobro.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
