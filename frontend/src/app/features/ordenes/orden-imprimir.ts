import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { OrdenesService } from '../../core/services/ordenes.service';
import { ETIQUETA_TIPO_DOCUMENTO, ETIQUETA_UNIDAD, Orden } from '../../core/models';
import { canalesIngreso, empresa as empresaDelServidor, etiquetasMetodo } from '../../core/estado/catalogos';
import { formatearFecha } from '../../shared/utilidades/fechas';
import { mensajeDeError } from '../../shared/utilidades/errores';

/**
 * Vista imprimible del contrato o la proforma (#68).
 *
 * Es la salida que el taller entrega al cliente en vez del talonario en papel.
 * Se imprime con el diálogo del navegador, que además permite "Guardar como
 * PDF" para mandarlo por WhatsApp: no hace falta una librería de PDF en el
 * servidor. Todo lo que muestra ya está guardado en la orden; los datos de la
 * empresa vienen del servidor, no se escriben aquí.
 */
@Component({
  selector: 'app-orden-imprimir',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orden-imprimir.html',
})
export class OrdenImprimirComponent {
  private ordenes = inject(OrdenesService);
  private ruta = inject(ActivatedRoute);

  readonly orden = signal<Orden | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');

  // Se lee al renderizar: tomar el alias directo quedaba en `undefined` en las pruebas.
  readonly empresa = computed(() => empresaDelServidor());
  readonly etiquetaTipo = computed(() => ETIQUETA_TIPO_DOCUMENTO);
  readonly etiquetaUnidad = computed(() => ETIQUETA_UNIDAD);
  readonly etiquetaMetodo = computed(() => etiquetasMetodo());
  readonly canales = computed(() => canalesIngreso());
  readonly formatearFecha = formatearFecha;

  /** Solo los pagos que cuentan como dinero recibido salen en el documento. */
  readonly pagosConformes = computed(() =>
    (this.orden()?.finanzas?.pagos ?? []).filter(
      pago => !pago.estado_pago || pago.estado_pago === 'conforme'
    )
  );

  readonly tieneItems = computed(() => (this.orden()?.items?.length ?? 0) > 0);

  constructor() {
    void this.cargar();
  }

  private async cargar(): Promise<void> {
    const id = Number(this.ruta.snapshot.paramMap.get('id'));
    try {
      this.orden.set(await this.ordenes.obtener(id));
    } catch (e) {
      this.error.set(mensajeDeError(e, 'No se pudo cargar la orden.'));
    } finally {
      this.cargando.set(false);
    }
  }

  etiquetaCanal(valor: string): string {
    return this.canales().find(c => c.valor === valor)?.etiqueta ?? valor;
  }

  imprimir(): void {
    window.print();
  }
}
