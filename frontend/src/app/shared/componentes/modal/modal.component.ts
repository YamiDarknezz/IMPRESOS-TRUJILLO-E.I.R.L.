import { Component, ElementRef, HostListener, OnDestroy, afterNextRender, inject, input, output, viewChild } from '@angular/core';

/** Elementos que reciben el foco con el teclado dentro del diálogo. */
const FOCALIZABLES =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Diálogos abiertos, el último es el de encima: solo ese responde a Escape. */
const abiertos: ModalComponent[] = [];
let contador = 0;

/**
 * Diálogo modal accesible (#38): se anuncia como `dialog`, se cierra con
 * Escape, mueve el foco al primer control al abrir, lo mantiene dentro
 * mientras está abierto y lo devuelve a quien lo abrió al cerrar.
 *
 * Se monta con `@if` desde la pantalla y se quita al recibir `cerrar`:
 *
 *   <app-modal titulo="Confirmar pago" (cerrar)="cerrarCobro()">
 *     <span class="modal-orden-id" modal-cabecera>{{ orden.id_documento }}</span>
 *     ...contenido y pie...
 *   </app-modal>
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
})
export class ModalComponent implements OnDestroy {
  readonly titulo = input.required<string>();
  /** Clase extra para el título (p. ej. `text-danger`). */
  readonly claseTitulo = input('');
  /** Clase extra para la caja del diálogo (p. ej. `modal-visor`). */
  readonly claseContenido = input('');
  /** Muestra el botón ✕ en la cabecera. */
  readonly conBotonCerrar = input(false);
  /**
   * Cerrar al hacer clic en el fondo. Se apaga en los formularios largos,
   * donde un clic fuera por descuido perdería lo escrito.
   */
  readonly cerrarAlClicFuera = input(true);

  readonly cerrar = output<void>();

  readonly idTitulo = `modal-titulo-${++contador}`;
  private readonly dialogo = viewChild.required<ElementRef<HTMLElement>>('dialogo');
  /** Quien tenía el foco al abrir: normalmente el botón que lo abrió. */
  private readonly previo = document.activeElement as HTMLElement | null;

  constructor() {
    abiertos.push(this);
    afterNextRender(() => this.enfocarPrimerControl());
  }

  ngOnDestroy(): void {
    const posicion = abiertos.indexOf(this);
    if (posicion >= 0) abiertos.splice(posicion, 1);
    // Si la fila que lo abrió ya no existe (la lista se recargó), no hay a dónde volver.
    if (this.previo?.isConnected) this.previo.focus();
  }

  @HostListener('document:keydown.escape', ['$event'])
  alPulsarEscape(evento: Event): void {
    if (abiertos[abiertos.length - 1] !== this) return;
    evento.preventDefault();
    this.cerrar.emit();
  }

  alClicFuera(): void {
    if (this.cerrarAlClicFuera()) this.cerrar.emit();
  }

  /** Tab y Mayús+Tab dan la vuelta dentro del diálogo en vez de salir a la página. */
  atraparTab(evento: Event, haciaAtras: boolean): void {
    const dialogo = this.dialogo().nativeElement;
    const controles = this.controles();
    if (controles.length === 0) {
      evento.preventDefault();
      dialogo.focus();
      return;
    }
    const primero = controles[0];
    const ultimo = controles[controles.length - 1];
    const activo = document.activeElement;
    if (haciaAtras && (activo === primero || activo === dialogo)) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!haciaAtras && activo === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  }

  private controles(): HTMLElement[] {
    return Array.from(this.dialogo().nativeElement.querySelectorAll<HTMLElement>(FOCALIZABLES))
      .filter(el => !el.hidden);
  }

  /** El primer campo del contenido; el ✕ solo si no hay otro, y si no, el propio diálogo. */
  private enfocarPrimerControl(): void {
    const dialogo = this.dialogo().nativeElement;
    const destino =
      this.controles().find(el => !el.classList.contains('modal-cerrar')) ??
      this.controles()[0] ??
      dialogo;
    destino.focus();
  }
}
