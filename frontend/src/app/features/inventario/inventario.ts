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
import {
  ConsumoPieza,
  ConsumoPiezaCreateData,
  MaterialInventario,
  MovimientoStock,
  PiezaLoteCreateData,
  PiezaLoteMaterial,
  TipoFormatoMaterial,
} from '../../core/models';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { formatearFecha } from '../../shared/utilidades/fechas';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

interface FormularioMaterial {
  nombre: string;
  unidadId: number | null;
  stockInicial: number;
  alertaMinima: number;
  diasReabastecimiento: number;
  precioCompra: number;
  ubicacionEstante: string;
  tipoFormato: TipoFormatoMaterial;
  anchoPredeterminadoM: number | null;
  largoPredeterminadoM: number | null;
  espesorMm: number | null;
}

function formularioVacio(): FormularioMaterial {
  return {
    nombre: '',
    unidadId: null,
    stockInicial: 0,
    alertaMinima: 0,
    diasReabastecimiento: 0,
    precioCompra: 0,
    ubicacionEstante: '',
    tipoFormato: 'unidad_pieza',
    anchoPredeterminadoM: null,
    largoPredeterminadoM: null,
    espesorMm: null,
  };
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

  readonly pestanaActiva = signal<'materiales' | 'piezas'>('materiales');
  readonly busqueda = signal('');
  readonly materialesFiltrados = computed(() =>
    filtrarMateriales(this.materiales(), this.busqueda())
  );

  // ── Rollos y Planchas Pre-establecidas ──────────────────────────────────
  readonly piezas = signal<PiezaLoteMaterial[]>([]);
  readonly piezaDetalle = signal<PiezaLoteMaterial | null>(null);
  readonly modalNuevaPieza = signal(false);
  readonly formPieza = signal<PiezaLoteCreateData>({
    material_id: 0,
    codigo_identificador: '',
    capacidad_inicial: 100,
    unidad_medida: 'm',
    costo_adquisicion: 0,
    ancho_m: null,
    largo_m: null,
    espesor_mm: null,
    ubicacion: '',
    maquina_asignada: '',
    nota: '',
  });

  readonly modalConsumo = signal(false);
  readonly piezaConsumo = signal<PiezaLoteMaterial | null>(null);
  readonly formConsumo = signal<ConsumoPiezaCreateData>({
    trabajo_descripcion: '',
    cantidad_consumida: 1,
    monto_cobrado: 0,
    merma_desperdicio: 0,
    nota: '',
  });

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

  readonly tiposFormato: { id: TipoFormatoMaterial; nombre: string }[] = [
    { id: 'continuo_rollo', nombre: 'Rollo Continuo (UV DTF, Lona, Vinil)' },
    { id: 'plancha_rigida', nombre: 'Plancha Rígida (MDF, Acrílico, Celtex)' },
    { id: 'unidad_pieza', nombre: 'Unidad / Pieza Suelta' },
    { id: 'quimico_tinta', nombre: 'Químico / Tinta' },
  ];

  constructor() {
    this.inventarioService.cargar();
    this.unidadesService.cargar();
    this.cargarPiezas();
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
        precio_compra: f.precioCompra,
        ubicacion_estante: f.ubicacionEstante,
        tipo_formato: f.tipoFormato,
        ancho_predeterminado_m: f.anchoPredeterminadoM,
        largo_predeterminado_m: f.largoPredeterminadoM,
        espesor_mm: f.espesorMm,
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
      unidadId: this.unidades().some(u => u.id === material.unidad_id) ? material.unidad_id : null,
      stockInicial: 0,
      stockActual: material.stock_actual,
      alertaMinima: material.alerta_minima,
      diasReabastecimiento: material.dias_reabastecimiento ?? 0,
      precioCompra: material.precio_compra ?? 0,
      ubicacionEstante: material.ubicacion_estante ?? '',
      tipoFormato: material.tipo_formato ?? 'unidad_pieza',
      anchoPredeterminadoM: material.ancho_predeterminado_m ?? null,
      largoPredeterminadoM: material.largo_predeterminado_m ?? null,
      espesorMm: material.espesor_mm ?? null,
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
          precio_compra: f.precioCompra,
          ubicacion_estante: f.ubicacionEstante,
          tipo_formato: f.tipoFormato,
          ancho_predeterminado_m: f.anchoPredeterminadoM,
          largo_predeterminado_m: f.largoPredeterminadoM,
          espesor_mm: f.espesorMm,
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

  // ── Gestión de Rollos y Planchas Pre-establecidas ─────────────────────────

  async cargarPiezas(): Promise<void> {
    try {
      const data = await this.inventarioService.listarPiezas();
      this.piezas.set(data);
    } catch (e) {
      console.error(e);
    }
  }

  cambiarPestana(p: 'materiales' | 'piezas'): void {
    this.pestanaActiva.set(p);
    if (p === 'piezas') this.cargarPiezas();
  }

  abrirNuevaPieza(): void {
    const mat = this.materiales()[0];
    this.formPieza.set({
      material_id: mat ? mat.id : 0,
      codigo_identificador: '',
      capacidad_inicial: mat?.tipo_formato === 'continuo_rollo' ? 100 : 1,
      unidad_medida: mat?.unidad || 'm',
      costo_adquisicion: mat?.precio_compra || 0,
      ancho_m: mat?.ancho_predeterminado_m || null,
      largo_m: mat?.largo_predeterminado_m || null,
      espesor_mm: mat?.espesor_mm || null,
      ubicacion: mat?.ubicacion_estante || '',
      maquina_asignada: '',
      nota: '',
    });
    this.modalNuevaPieza.set(true);
  }

  cerrarNuevaPieza(): void {
    this.modalNuevaPieza.set(false);
  }

  actualizarPieza(campo: keyof PiezaLoteCreateData, valor: any): void {
    this.formPieza.update(f => ({ ...f, [campo]: valor }));
  }

  alCambiarMaterialPieza(materialId: number): void {
    const mat = this.materiales().find(m => m.id === Number(materialId));
    if (mat) {
      this.formPieza.update(f => ({
        ...f,
        material_id: mat.id,
        unidad_medida: mat.unidad || 'm',
        costo_adquisicion: mat.precio_compra || 0,
        ancho_m: mat.ancho_predeterminado_m || null,
        largo_m: mat.largo_predeterminado_m || null,
        espesor_mm: mat.espesor_mm || null,
        ubicacion: mat.ubicacion_estante || '',
      }));
    }
  }

  async guardarNuevaPieza(): Promise<void> {
    const f = this.formPieza();
    if (!f.material_id) {
      alert('Selecciona un material.');
      return;
    }
    if (!f.codigo_identificador.trim()) {
      alert('Ingresa un código identificador (ej: ROLL-UV-01).');
      return;
    }
    if (f.capacidad_inicial <= 0) {
      alert('La capacidad inicial debe ser mayor a 0.');
      return;
    }

    this.guardando.set(true);
    try {
      await this.inventarioService.registrarPieza(f);
      this.cerrarNuevaPieza();
      await this.cargarPiezas();
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo registrar la pieza o rollo.'));
    } finally {
      this.guardando.set(false);
    }
  }

  abrirConsumo(pieza: PiezaLoteMaterial): void {
    this.piezaConsumo.set(pieza);
    this.formConsumo.set({
      trabajo_descripcion: '',
      cantidad_consumida: 1,
      monto_cobrado: 0,
      merma_desperdicio: 0,
      nota: '',
    });
    this.modalConsumo.set(true);
  }

  cerrarConsumo(): void {
    this.modalConsumo.set(false);
    this.piezaConsumo.set(null);
  }

  actualizarConsumo(campo: keyof ConsumoPiezaCreateData, valor: any): void {
    this.formConsumo.update(f => ({ ...f, [campo]: valor }));
  }

  async guardarConsumo(): Promise<void> {
    const pieza = this.piezaConsumo();
    if (!pieza) return;
    const f = this.formConsumo();
    if (!f.trabajo_descripcion.trim()) {
      alert('Ingresa la descripción del trabajo.');
      return;
    }
    if (f.cantidad_consumida <= 0) {
      alert('La cantidad consumida debe ser mayor a 0.');
      return;
    }
    if (f.cantidad_consumida > pieza.saldo_restante) {
      alert(`La cantidad solicitada supera el saldo disponible (${pieza.saldo_restante} ${pieza.unidad_medida}).`);
      return;
    }

    this.guardando.set(true);
    try {
      await this.inventarioService.registrarConsumoPieza(pieza.id, f);
      this.cerrarConsumo();
      await this.cargarPiezas();
      if (this.piezaDetalle()?.id === pieza.id) {
        this.piezaDetalle.set(await this.inventarioService.obtenerPieza(pieza.id));
      }
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo registrar el consumo.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async verDetallePieza(pieza: PiezaLoteMaterial): Promise<void> {
    try {
      const detalle = await this.inventarioService.obtenerPieza(pieza.id);
      this.piezaDetalle.set(detalle);
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cargar el detalle de la pieza.'));
    }
  }

  cerrarDetallePieza(): void {
    this.piezaDetalle.set(null);
  }
}
