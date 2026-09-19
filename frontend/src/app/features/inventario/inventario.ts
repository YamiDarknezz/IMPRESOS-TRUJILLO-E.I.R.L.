import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  InventarioService,
  filtrarMateriales,
  tieneStockBajo,
} from '../../core/services/inventario.service';
import { UnidadesService } from '../../core/services/unidades.service';
import { SesionService } from '../../core/services/sesion.service';
import { MaterialInventario, MovimientoStock } from '../../core/models';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { formatearFecha } from '../../shared/utilidades/fechas';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

interface FormularioMaterial {
  nombre: string;
  unidadId: number | null;
  stockInicial: number;
  alertaMinima: number;
  diasReabastecimiento: number;
}

function formularioVacio(): FormularioMaterial {
  return { nombre: '', unidadId: null, stockInicial: 0, alertaMinima: 0, diasReabastecimiento: 0 };
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './inventario.html',
})
export class InventarioComponent {
  private inventarioService = inject(InventarioService);
  unidadesService = inject(UnidadesService);
  sesion = inject(SesionService);

  readonly materiales = this.inventarioService.materiales;
  readonly unidades = this.unidadesService.unidades;

  readonly busqueda = signal('');
  readonly materialesFiltrados = computed(() =>
    filtrarMateriales(this.materiales(), this.busqueda())
  );

  readonly mostrarFormulario = signal(false);
  readonly form = signal<FormularioMaterial>(formularioVacio());
  readonly errores = signal<Record<string, string>>({});
  readonly guardando = signal(false);

  /** Material cuya ficha se está editando (null = ninguno). */
  readonly editando = signal<MaterialInventario | null>(null);
  readonly formEdicion = signal({ ...formularioVacio(), stockActual: 0 });

  /** Movimientos del material consultado (trazabilidad). */
  readonly materialMovimientos = signal<MaterialInventario | null>(null);
  readonly movimientos = signal<MovimientoStock[]>([]);

  readonly tieneStockBajo = tieneStockBajo;
  readonly formatearFecha = formatearFecha;

  constructor() {
    this.inventarioService.cargar();
    this.unidadesService.cargar();
  }

  // ── Alta de material ─────────────────────────────────────────────────────

  alternarFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.form.set(formularioVacio());
      this.errores.set({});
    }
  }

  actualizar<K extends keyof FormularioMaterial>(campo: K, valor: FormularioMaterial[K]): void {
    this.form.update(f => ({ ...f, [campo]: valor }));
    if (this.errores()[campo]) this.errores.update(e => ({ ...e, [campo]: '' }));
  }

  private validar(f: { nombre: string; unidadId: number | null }): Record<string, string> {
    const errores: Record<string, string> = {};
    if (!f.nombre.trim()) errores['nombre'] = 'El nombre es requerido.';
    if (!f.unidadId) errores['unidadId'] = 'La unidad es requerida.';
    return errores;
  }

  async guardar(): Promise<void> {
    const f = this.form();
    const errores = this.validar(f);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    const unidad = this.unidades().find(u => u.id === f.unidadId);
    const confirmado = confirm(
      `¿Registrar el material "${f.nombre}" con stock inicial ${f.stockInicial} ${unidad?.abreviatura ?? ''}?`
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.inventarioService.crear({
        nombre: f.nombre,
        unidad_id: f.unidadId as number,
        stock_inicial: f.stockInicial,
        alerta_minima: f.alertaMinima,
        dias_reabastecimiento: f.diasReabastecimiento,
      });
      this.alternarFormulario();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al guardar el material.'));
    } finally {
      this.guardando.set(false);
    }
  }

  // ── Edición de material ──────────────────────────────────────────────────

  abrirEdicion(material: MaterialInventario): void {
    this.editando.set(material);
    this.errores.set({});
    this.formEdicion.set({
      nombre: material.nombre,
      // Si la unidad guardada no está en el catálogo (dato viejo), se deja
      // vacía para forzar elegir una válida.
      unidadId: this.unidades().some(u => u.id === material.unidad_id) ? material.unidad_id : null,
      stockInicial: 0,
      stockActual: material.stock_actual,
      alertaMinima: material.alerta_minima,
      diasReabastecimiento: material.dias_reabastecimiento ?? 0,
    });
  }

  cerrarEdicion(): void {
    this.editando.set(null);
    this.errores.set({});
  }

  actualizarEdicion(campo: string, valor: unknown): void {
    this.formEdicion.update(f => ({ ...f, [campo]: valor }));
    if (this.errores()[campo]) this.errores.update(e => ({ ...e, [campo]: '' }));
  }

  async guardarEdicion(): Promise<void> {
    const material = this.editando();
    if (!material) return;

    const f = this.formEdicion();
    const errores = this.validar(f);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    this.guardando.set(true);
    try {
      await this.inventarioService.actualizar(
        material.id,
        {
          nombre: f.nombre,
          unidad_id: f.unidadId as number,
          alerta_minima: f.alertaMinima,
          dias_reabastecimiento: f.diasReabastecimiento,
        },
        f.stockActual,
        material.stock_actual,
      );
      this.cerrarEdicion();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al editar el material.'));
    } finally {
      this.guardando.set(false);
    }
  }

  // ── Trazabilidad de movimientos ──────────────────────────────────────────

  async verMovimientos(material: MaterialInventario): Promise<void> {
    try {
      this.movimientos.set(await this.inventarioService.listarMovimientos(material.id));
      this.materialMovimientos.set(material);
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cargar el historial del material.'));
    }
  }

  cerrarMovimientos(): void {
    this.materialMovimientos.set(null);
    this.movimientos.set([]);
  }
}
