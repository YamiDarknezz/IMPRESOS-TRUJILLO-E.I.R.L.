import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  OrdenesService,
  claseEstado,
  estaEnPipeline,
  estaVencida,
  estadosDisponibles,
  filtrarOrdenes,
} from '../../core/services/ordenes.service';
import { SesionService, nombreVisible } from '../../core/services/sesion.service';
import { ComprobantesService } from '../../core/services/comprobantes.service';
import {
  Comprobante,
  ETIQUETA_ESTADO,
  ETIQUETA_METODO,
  ETIQUETA_UNIDAD,
  EstadoOrden,
  METODOS_PAGO,
  MaterialComplecion,
  MetodoPago,
  Orden,
} from '../../core/models';
import { formatearFecha } from '../../shared/utilidades/fechas';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { etiquetasMetodo, metodosPago as metodosDelServidor } from '../../core/estado/catalogos';
import {
  CapturaElegida,
  capturasDesdeArchivos,
  liberarCaptura,
  pesoLegible,
} from '../../shared/utilidades/imagenes';
import { IconComponent } from '../../shared/componentes/icon/icon.component';
import { ModalComponent } from '../../shared/componentes/modal/modal.component';
import { VentaRapidaComponent } from './venta-rapida/venta-rapida';

type FiltroEstado = 'todos' | EstadoOrden;

interface OpcionFiltro {
  valor: FiltroEstado;
  etiqueta: string;
}

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, ModalComponent, VentaRapidaComponent],
  templateUrl: './ordenes.html',
})
export class OrdenesComponent {
  private ordenesService = inject(OrdenesService);
  private comprobantes = inject(ComprobantesService);
  sesion = inject(SesionService);

  readonly ordenes = this.ordenesService.ordenes;
  readonly cargando = this.ordenesService.cargando;

  // Métricas del panel (solo supervisión)
  // Cuántas hay en total en el servidor y si quedan bloques por traer (#27).
  readonly totalOrdenes = this.ordenesService.totalOrdenes;
  readonly hayMasOrdenes = this.ordenesService.hayMasOrdenes;
  readonly cargandoMas = this.ordenesService.cargandoMasOrdenes;

  readonly enProceso = this.ordenesService.enProceso;
  readonly finalizadas = this.ordenesService.finalizadas;
  readonly vencidas = this.ordenesService.vencidas;
  readonly porCobrar = this.ordenesService.porCobrar;

  // ── Filtros ──────────────────────────────────────────────────────────────
  readonly filtroEstado = signal<FiltroEstado>('todos');
  readonly busqueda = signal('');
  readonly desde = signal('');
  readonly hasta = signal('');

  readonly opcionesFiltro: OpcionFiltro[] = [
    { valor: 'todos',         etiqueta: 'Todos' },
    { valor: 'pendiente',     etiqueta: 'Pendientes' },
    { valor: 'en_diseno',     etiqueta: 'En diseño' },
    { valor: 'aprobado',      etiqueta: 'Aprobadas' },
    { valor: 'en_produccion', etiqueta: 'En producción' },
    { valor: 'finalizada',    etiqueta: 'Finalizadas' },
    { valor: 'entregada',     etiqueta: 'Entregadas' },
    { valor: 'cancelada',     etiqueta: 'Canceladas' },
  ];

  readonly ordenesFiltradas = computed(() =>
    filtrarOrdenes(this.ordenes(), {
      estado: this.filtroEstado(),
      texto: this.busqueda(),
      desde: this.desde(),
      hasta: this.hasta(),
    })
  );

  readonly hayFiltroFecha = computed(() => !!(this.desde() || this.hasta()));

  // ── Estado de la interfaz ────────────────────────────────────────────────
  readonly error = signal('');
  readonly guardando = signal(false);

  /** Orden cuyo consumo real se está reportando. */
  readonly ordenACompletar = signal<Orden | null>(null);
  readonly materialesComplecion = signal<MaterialComplecion[]>([]);

  readonly ventaRapidaAbierta = signal(false);

  /** Orden cuyo saldo se está cobrando. */
  readonly ordenACobrar = signal<Orden | null>(null);
  readonly metodoPago = signal<MetodoPago>('efectivo');
  readonly referenciaPago = signal('');

  // Helpers reexpuestos para la plantilla
  readonly etiquetaEstado = ETIQUETA_ESTADO;
  readonly etiquetaMetodo = etiquetasMetodo;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  // Se lee al renderizar: tomar el alias directo quedaba en `undefined` en las pruebas.
  readonly metodosPago = computed(() => metodosDelServidor());
  readonly formatearFecha = formatearFecha;
  readonly estaEnPipeline = estaEnPipeline;
  readonly estaVencida = estaVencida;
  readonly estadosDisponibles = estadosDisponibles;
  readonly claseEstado = claseEstado;
  readonly nombreVisible = nombreVisible;

  constructor() {
    this.ordenesService.cargar();
    // Las tarjetas salen de las métricas del backend, no de la lista cargada.
    this.ordenesService.cargarMetricas();
  }

  /** Vuelve a pedir las órdenes y los indicadores (otros usuarios también las mueven). */
  async actualizar(): Promise<void> {
    try {
      await Promise.all([this.ordenesService.recargar(), this.ordenesService.cargarMetricas()]);
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudieron actualizar las órdenes.'));
    }
  }

  /** Trae el siguiente bloque de órdenes (la tabla viene paginada). */
  cargarMas(): void {
    void this.ordenesService.cargarMasOrdenes();
  }

  limpiarFiltroFecha(): void {
    this.desde.set('');
    this.hasta.set('');
  }

  // ── Etapa y asignación ───────────────────────────────────────────────────

  async cambiarEstado(orden: Orden, estado: EstadoOrden): Promise<void> {
    if (orden.estado === estado) return;

    if (estado === 'entregada') {
      // El backend también lo impide; aquí se avisa antes de intentarlo.
      if (!orden.finanzas?.pagado_totalmente) {
        alert(
          'No se puede entregar una orden que no está pagada en su totalidad.\n\n' +
          'Registrá el pago con "Pago recibido" antes de marcarla como entregada.'
        );
        return;
      }
      const confirmado = confirm(
        `¿Marcar la orden ${orden.id_documento} de "${orden.cliente}" como ENTREGADA?\n\n` +
        'La entrega es definitiva: no se puede deshacer.'
      );
      if (!confirmado) return;
    }

    try {
      await this.ordenesService.cambiarEstado(orden, estado);
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cambiar el estado de la orden.'));
    }
  }

  async asignar(orden: Orden, idUsuario: string): Promise<void> {
    try {
      await this.ordenesService.asignar(orden, idUsuario ? Number(idUsuario) : null);
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo asignar la orden.'));
    }
  }

  async cancelar(orden: Orden): Promise<void> {
    const confirmado = confirm(
      `¿Cancelar la orden ${orden.id_documento} de "${orden.cliente}"?\n\n` +
      'Se devolverá el stock reservado al inventario.'
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.ordenesService.cancelar(orden.id);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al cancelar la orden.'));
    } finally {
      this.guardando.set(false);
    }
  }

  // ── Reportar uso de materiales ───────────────────────────────────────────

  abrirCompletar(orden: Orden): void {
    this.ordenACompletar.set(orden);
    this.materialesComplecion.set(
      (orden.materiales?.estimados ?? []).map(m => ({
        id_material: m.id_material,
        nombre: m.nombre,
        cantidad_estimada: m.cantidad,
        cantidad_real: m.cantidad,
      }))
    );
  }

  /**
   * Cambia la cantidad real de un material copiando la lista: el `computed`
   * de sobrantes solo se recalcula si el signal recibe un arreglo nuevo (#29).
   */
  cambiarCantidadReal(idMaterial: number, cantidad: number): void {
    this.materialesComplecion.update(lista =>
      lista.map(m => (m.id_material === idMaterial ? { ...m, cantidad_real: Number(cantidad) || 0 } : m))
    );
  }

  cerrarCompletar(): void {
    this.ordenACompletar.set(null);
    this.materialesComplecion.set([]);
  }

  /** Materiales de los que se usó menos: el sobrante vuelve al inventario. */
  readonly sobrantes = computed(() =>
    this.materialesComplecion()
      .filter(m => m.cantidad_real < m.cantidad_estimada)
      .map(m => ({ nombre: m.nombre, sobrante: m.cantidad_estimada - m.cantidad_real }))
  );

  async confirmarProduccion(): Promise<void> {
    const orden = this.ordenACompletar();
    if (!orden) return;

    // Devolver material al stock solo tiene sentido si quedó reutilizable:
    // por eso se confirma en lugar de hacerlo en silencio.
    const sobrantes = this.sobrantes();
    if (sobrantes.length > 0) {
      const detalle = sobrantes.map(s => `  • ${s.sobrante} × ${s.nombre}`).join('\n');
      const confirmado = confirm(
        `Usaste menos material del estimado. Se devolverá al inventario:\n\n${detalle}\n\n` +
        'Confirmá solo si ese material quedó reutilizable. ¿Continuar?'
      );
      if (!confirmado) return;
    }

    this.guardando.set(true);
    try {
      await this.ordenesService.completar(
        orden.id,
        this.materialesComplecion().map(m => ({
          material_id: m.id_material,
          cantidad: m.cantidad_real,
        }))
      );
      this.cerrarCompletar();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al completar la orden.'));
    } finally {
      this.guardando.set(false);
    }
  }

  // ── Cobro del saldo ──────────────────────────────────────────────────────

  abrirCobro(orden: Orden): void {
    this.ordenACobrar.set(orden);
    this.metodoPago.set(orden.finanzas?.metodo_pago_adelanto ?? 'efectivo');
    this.referenciaPago.set('');
    this.limpiarAdjuntosCobro();
  }

  cerrarCobro(): void {
    this.ordenACobrar.set(null);
    this.limpiarAdjuntosCobro();
  }

  async confirmarPago(): Promise<void> {
    const orden = this.ordenACobrar();
    if (!orden) return;

    this.guardando.set(true);
    try {
      const actualizada = await this.ordenesService.confirmarPago(
        orden.id,
        this.metodoPago(),
        this.referenciaPago().trim()
      );

      const pendientes = this.adjuntosCobro();
      if (pendientes.length > 0) {
        // La captura respalda el abono que se acaba de registrar: el de id más
        // alto. Si por lo que sea no vuelve ninguno, queda colgada de la orden.
        const pagos = actualizada.finanzas?.pagos ?? [];
        const ultimo = pagos.reduce(
          (mayor, pago) => (pago.id > (mayor?.id ?? 0) ? pago : mayor),
          pagos[0]
        );

        const { fallidos } = await this.comprobantes.subirVarias(
          actualizada.id,
          pendientes.map(adjunto => adjunto.archivo),
          ultimo?.id ?? null
        );
        if (fallidos.length > 0) {
          alert(
            'El pago quedó registrado, pero estas capturas no subieron:\n' +
              fallidos.map(fallo => `• ${fallo.nombre}: ${fallo.motivo}`).join('\n')
          );
        }
      }
      this.cerrarCobro();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al confirmar el pago.'));
    } finally {
      this.guardando.set(false);
    }
  }

  // ── Capturas de pago (RF-11) ─────────────────────────────────────────────
  // El respaldo del cobro: la captura del Yape o la transferencia. Opcional,
  // porque el pago se registra igual cuando el voucher llega después.

  readonly adjuntosCobro = signal<CapturaElegida[]>([]);
  /** Orden cuyas capturas se están viendo. */
  readonly capturasVisibles = signal<Orden | null>(null);

  readonly pesoLegible = pesoLegible;
  readonly urlDe = (captura: Comprobante): string => this.comprobantes.urlDe(captura);
  readonly resumenCaptura = (captura: Comprobante): string => this.comprobantes.resumen(captura);

  agregarAdjuntosCobro(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const { aceptadas, rechazadas } = capturasDesdeArchivos(entrada.files);
    entrada.value = '';

    if (rechazadas > 0) {
      alert('Solo se aceptan capturas en JPG, PNG o WebP, o un PDF.');
    }
    this.adjuntosCobro.update(actuales => [...actuales, ...aceptadas]);
  }

  quitarAdjuntoCobro(indice: number): void {
    const adjunto = this.adjuntosCobro()[indice];
    if (adjunto) liberarCaptura(adjunto);
    this.adjuntosCobro.update(actuales => actuales.filter((_, posicion) => posicion !== indice));
  }

  private limpiarAdjuntosCobro(): void {
    this.adjuntosCobro().forEach(liberarCaptura);
    this.adjuntosCobro.set([]);
  }

  abrirCapturas(orden: Orden): void {
    this.capturasVisibles.set(orden);
  }

  cerrarCapturas(): void {
    this.capturasVisibles.set(null);
  }
}
