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
import {
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
import { IconComponent } from '../../shared/componentes/icon/icon.component';

type FiltroEstado = 'todos' | EstadoOrden;

interface OpcionFiltro {
  valor: FiltroEstado;
  etiqueta: string;
}

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent],
  templateUrl: './ordenes.html',
})
export class OrdenesComponent {
  private ordenesService = inject(OrdenesService);
  sesion = inject(SesionService);

  readonly ordenes = this.ordenesService.ordenes;
  readonly cargando = this.ordenesService.cargando;

  // Métricas del panel (solo supervisión)
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

  /** Orden cuyo saldo se está cobrando. */
  readonly ordenACobrar = signal<Orden | null>(null);
  readonly metodoPago = signal<MetodoPago>('efectivo');
  readonly referenciaPago = signal('');

  // Helpers reexpuestos para la plantilla
  readonly etiquetaEstado = ETIQUETA_ESTADO;
  readonly etiquetaMetodo = ETIQUETA_METODO;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  readonly metodosPago = METODOS_PAGO;
  readonly formatearFecha = formatearFecha;
  readonly estaEnPipeline = estaEnPipeline;
  readonly estaVencida = estaVencida;
  readonly estadosDisponibles = estadosDisponibles;
  readonly claseEstado = claseEstado;
  readonly nombreVisible = nombreVisible;

  constructor() {
    this.ordenesService.cargar();
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
  }

  cerrarCobro(): void {
    this.ordenACobrar.set(null);
  }

  async confirmarPago(): Promise<void> {
    const orden = this.ordenACobrar();
    if (!orden) return;

    this.guardando.set(true);
    try {
      await this.ordenesService.confirmarPago(
        orden.id,
        this.metodoPago(),
        this.referenciaPago().trim()
      );
      this.cerrarCobro();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al confirmar el pago.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
