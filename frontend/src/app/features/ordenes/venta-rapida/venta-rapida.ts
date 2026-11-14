import { Component, computed, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OrdenesService } from '../../../core/services/ordenes.service';
import { ComprobantesService } from '../../../core/services/comprobantes.service';
import { ETIQUETA_UNIDAD, MetodoPago, UNIDADES_NEGOCIO, UnidadNegocio } from '../../../core/models';
import { etiquetasMetodo, metodosPago } from '../../../core/estado/catalogos';
import { mensajeDeError } from '../../../shared/utilidades/errores';
import { ModalComponent } from '../../../shared/componentes/modal/modal.component';

/**
 * Venta de mostrador: cobra al contado un servicio o producto que no lleva
 * producción. Lo que registra es una orden (`/api/ordenes/caja-rapida`), por
 * eso vive en Órdenes y no en Caja (#12). El padre lo monta con `@if` y lo
 * quita al recibir `cerrado`, así cada apertura parte de un formulario limpio.
 */
@Component({
  selector: 'app-venta-rapida',
  standalone: true,
  imports: [FormsModule, ModalComponent],
  templateUrl: './venta-rapida.html',
})
export class VentaRapidaComponent {
  private ordenesService = inject(OrdenesService);
  private comprobantes = inject(ComprobantesService);

  /** Se emite al cancelar y también tras registrar la venta. */
  readonly cerrado = output<void>();

  readonly descripcion = signal('');
  readonly monto = signal<number | null>(null);
  readonly metodo = signal<MetodoPago>('efectivo');
  readonly unidad = signal<UnidadNegocio>('imprenta');
  readonly cliente = signal('Cliente Mostrador');
  readonly referencia = signal('');
  readonly mixto = signal(false);
  readonly efectivo = signal<number | null>(null);
  readonly yape = signal<number | null>(null);
  readonly metodoYape = signal<MetodoPago>('yape_marcell');
  readonly archivos = signal<File[]>([]);
  readonly guardando = signal(false);

  readonly unidades = UNIDADES_NEGOCIO;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  readonly etiquetaMetodo = etiquetasMetodo;
  // Del servidor: ningún método de pago se escribe a mano en la pantalla.
  readonly metodos = computed(() => metodosPago());

  cerrar(): void {
    this.cerrado.emit();
  }

  seleccionarArchivos(evento: Event): void {
    this.archivos.set(Array.from((evento.target as HTMLInputElement).files ?? []));
  }

  async guardar(): Promise<void> {
    const descripcion = this.descripcion().trim();
    const monto = Number(this.monto());
    if (!descripcion) {
      alert('Ingresa la descripción del servicio o producto rápido.');
      return;
    }
    if (!monto || monto <= 0) {
      alert('Ingresa un monto válido mayor a 0.');
      return;
    }

    const efectivo = Number(this.efectivo() ?? 0);
    const yape = Number(this.yape() ?? 0);
    if (this.mixto() && (!Number.isFinite(efectivo) || !Number.isFinite(yape) || efectivo <= 0 || yape <= 0 || Math.round((efectivo + yape) * 100) > Math.round(monto * 100))) {
      alert('Ingresa importes válidos de efectivo y Yape cuya suma no supere el total.');
      return;
    }

    this.guardando.set(true);
    try {
      const creada = await this.ordenesService.crearVentaRapida({
        descripcion,
        monto_total: monto,
        metodo_pago: this.mixto() ? 'efectivo' : this.metodo(),
        unidad_negocio: this.unidad(),
        cliente_nombre: this.cliente().trim() || 'Cliente Mostrador',
        referencia: this.referencia().trim(),
        ...(this.mixto() ? { pagos: [{ metodo: 'efectivo' as const, monto: efectivo }, { metodo: this.metodoYape(), monto: yape }] } : {}),
      });
      if (this.archivos().length && (this.mixto() || this.metodo().startsWith('yape'))) {
        const pago = creada.finanzas?.pagos?.find(p => p.metodo.startsWith('yape'));
        const resultado = await this.comprobantes.subirVarias(creada.id, this.archivos(), pago?.id ?? null);
        if (resultado.fallidos.length) alert('La venta quedó registrada, pero no se pudieron subir algunas capturas. Adjunta los archivos desde la orden.');
      }
      this.cerrar();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo registrar la venta rápida.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
