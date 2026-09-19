import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InventarioService } from '../../core/services/inventario.service';
import { DatosProducto, ProductosService } from '../../core/services/productos.service';
import {
  ETIQUETA_TIPO_PRODUCTO,
  MaterialItem,
  Producto,
  TIPOS_PRODUCTO,
  TipoProducto,
} from '../../core/models';
import { mensajeDeError } from '../../shared/utilidades/errores';

function formularioVacio(): DatosProducto {
  return {
    nombre: '', tipo: 'propio' as TipoProducto, precio_base: 0,
    notas: '', materiales: [] as MaterialItem[],
  };
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
})
export class ProductosComponent {
  private productosService = inject(ProductosService);
  private inventarioService = inject(InventarioService);

  readonly productos = this.productosService.productos;
  readonly materiales = this.inventarioService.materiales;

  readonly mostrarFormulario = signal(false);
  readonly editando = signal<Producto | null>(null);
  readonly form = signal<DatosProducto>(formularioVacio());
  readonly errores = signal<Record<string, string>>({});
  readonly guardando = signal(false);

  readonly materialSelId = signal('');
  readonly materialSelCantidad = signal(1);

  readonly tiposProducto = TIPOS_PRODUCTO;
  readonly etiquetaTipo = ETIQUETA_TIPO_PRODUCTO;

  /** La receta solo aplica a lo que se produce en el taller. */
  readonly usaReceta = computed(() => this.form().tipo === 'propio');

  constructor() {
    this.productosService.cargar();
    this.inventarioService.cargar();
  }

  alternarFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.form.set(formularioVacio());
      this.editando.set(null);
      this.errores.set({});
    }
  }

  actualizar<K extends keyof DatosProducto>(campo: K, valor: DatosProducto[K]): void {
    this.form.update(f => ({ ...f, [campo]: valor }));
    if (this.errores()[campo]) this.errores.update(e => ({ ...e, [campo]: '' }));
  }

  abrirEdicion(producto: Producto): void {
    this.editando.set(producto);
    this.form.set({
      nombre: producto.nombre,
      tipo: producto.tipo,
      precio_base: producto.precio_base,
      notas: producto.notas,
      materiales: (producto.materiales ?? []).map(m => ({ ...m })),
    });
    this.errores.set({});
    this.mostrarFormulario.set(true);
  }

  // ── Receta de materiales ─────────────────────────────────────────────────

  agregarMaterial(): void {
    const material = this.materiales().find(m => String(m.id) === this.materialSelId());
    const cantidad = this.materialSelCantidad();
    if (!material || cantidad <= 0) return;

    this.form.update(f => {
      const yaEsta = f.materiales.some(m => m.id_material === material.id);
      const materiales = yaEsta
        ? f.materiales.map(m =>
            m.id_material === material.id ? { ...m, cantidad: m.cantidad + cantidad } : m
          )
        : [...f.materiales, { id_material: material.id, nombre: material.nombre, cantidad, unidad: material.unidad }];
      return { ...f, materiales };
    });

    this.materialSelId.set('');
    this.materialSelCantidad.set(1);
  }

  quitarMaterial(indice: number): void {
    this.form.update(f => ({
      ...f,
      materiales: f.materiales.filter((_, i) => i !== indice),
    }));
  }

  // ── Guardar y eliminar ───────────────────────────────────────────────────

  async guardar(): Promise<void> {
    const form = this.form();
    if (!form.nombre.trim()) {
      this.errores.set({ nombre: 'El nombre es requerido.' });
      return;
    }

    this.guardando.set(true);
    try {
      const editando = this.editando();
      if (editando) {
        await this.productosService.actualizar(editando.id, form);
      } else {
        await this.productosService.crear(form);
      }
      this.alternarFormulario();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al guardar el producto.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async eliminar(producto: Producto): Promise<void> {
    const confirmado = confirm(
      `¿Eliminar el producto "${producto.nombre}"?\n\n` +
      'Las órdenes que ya lo usaron no se modifican.'
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.productosService.desactivar(producto.id);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al eliminar el producto.'));
    } finally {
      this.guardando.set(false);
    }
  }
}
