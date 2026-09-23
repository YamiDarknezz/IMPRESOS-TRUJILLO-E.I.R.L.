import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CajaService } from '../../core/services/caja.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { SesionService } from '../../core/services/sesion.service';
import {
  AcumuladoCaja,
  CierreCaja,
  DetalleCaja,
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
 * Se auditan y observan cobros fraudulentos o erróneos antes del arqueo.
 */
@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './caja.html',
})
export class CajaComponent {
  private cajaService = inject(CajaService);
  private ordenesService = inject(OrdenesService);
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

  // ── Modal Venta Rápida / Mostrador ──────────────────────────────────────
  readonly modalVentaRapida = signal(false);
  readonly vrDescripcion = signal('');
  readonly vrMonto = signal<number | null>(null);
  readonly vrMetodo = signal<MetodoPago>('efectivo');
  readonly vrUnidad = signal<UnidadNegocio>('imprenta');
  readonly vrCliente = signal('Cliente Mostrador');
  readonly vrReferencia = signal('');

  readonly unidades = UNIDADES_NEGOCIO;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  readonly etiquetaMetodo = ETIQUETA_METODO;
  readonly metodos: MetodoPago[] = ['efectivo', 'yape', 'transferencia'];
  readonly formatearFecha = formatearFecha;

  readonly motivosObservacion = [
    { id: 'yape_falso', nombre: 'Yape falso / Captura trucada' },
    { id: 'billete_falso', nombre: 'Billete falso' },
    { id: 'voucher_no_ubicado', nombre: 'Voucher no encontrado en cuenta' },
    { id: 'cobro_duplicado', nombre: 'Cobro duplicado' },
    { id: 'error_digitacion', nombre: 'Error de digitación' },
    { id: 'otro', nombre: 'Otro motivo' },
  ];

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

  // ── Acciones de Venta Rápida / Mostrador ───────────────────────────────────

  abrirModalVentaRapida(): void {
    this.vrDescripcion.set('');
    this.vrMonto.set(null);
    this.vrMetodo.set('efectivo');
    this.vrUnidad.set('imprenta');
    this.vrCliente.set('Cliente Mostrador');
    this.vrReferencia.set('');
    this.modalVentaRapida.set(true);
  }

  cerrarModalVentaRapida(): void {
    this.modalVentaRapida.set(false);
  }

  async guardarVentaRapida(): Promise<void> {
    const descripcion = this.vrDescripcion().trim();
    const monto = Number(this.vrMonto());
    if (!descripcion) {
      alert('Ingresa la descripción del servicio o producto rápido.');
      return;
    }
    if (!monto || monto <= 0) {
      alert('Ingresa un monto válido mayor a 0.');
      return;
    }

    this.guardando.set(true);
    try {
      await this.ordenesService.crearVentaRapida({
        descripcion,
        monto_total: monto,
        metodo_pago: this.vrMetodo(),
        unidad_negocio: this.vrUnidad(),
        cliente_nombre: this.vrCliente().trim() || 'Cliente Mostrador',
        referencia: this.vrReferencia().trim(),
      });
      this.cerrarModalVentaRapida();
      await this.cargar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo registrar la venta rápida.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
