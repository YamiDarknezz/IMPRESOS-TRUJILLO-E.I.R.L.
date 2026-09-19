import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClientesService, DatosCliente, filtrarClientes } from '../../core/services/clientes.service';
import { Cliente, ResumenCliente, TIPOS_CLIENTE, TipoCliente } from '../../core/models';
import { SesionService } from '../../core/services/sesion.service';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { IconComponent } from '../../shared/componentes/icon/icon.component';

function formularioVacio(): DatosCliente {
  return {
    nombre: '', tipo: 'persona' as TipoCliente, documento: '',
    telefono: '', email: '', direccion: '', notas: '', es_corporativo: false,
  };
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './clientes.html',
})
export class ClientesComponent {
  private clientesService = inject(ClientesService);
  sesion = inject(SesionService);

  readonly clientes = this.clientesService.clientes;

  readonly busqueda = signal('');
  readonly clientesFiltrados = computed(() =>
    filtrarClientes(this.clientes(), this.busqueda())
  );

  readonly mostrarFormulario = signal(false);
  readonly editando = signal<Cliente | null>(null);
  readonly form = signal<DatosCliente>(formularioVacio());
  readonly errores = signal<Record<string, string>>({});
  readonly guardando = signal(false);

  /** Ficha ampliada: datos del cliente + resumen financiero del servidor. */
  readonly detalle = signal<Cliente | null>(null);
  readonly resumen = signal<ResumenCliente | null>(null);

  readonly tiposCliente = TIPOS_CLIENTE;

  constructor() {
    this.clientesService.cargar();
  }

  alternarFormulario(): void {
    this.mostrarFormulario.update(v => !v);
    if (!this.mostrarFormulario()) {
      this.form.set(formularioVacio());
      this.editando.set(null);
      this.errores.set({});
    }
  }

  actualizar<K extends keyof DatosCliente>(campo: K, valor: DatosCliente[K]): void {
    this.form.update(f => ({ ...f, [campo]: valor }));
    if (this.errores()[campo]) this.errores.update(e => ({ ...e, [campo]: '' }));
  }

  abrirEdicion(cliente: Cliente): void {
    this.editando.set(cliente);
    this.form.set({
      nombre: cliente.nombre,
      tipo: cliente.tipo,
      documento: cliente.documento,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion,
      notas: cliente.notas,
      es_corporativo: cliente.es_corporativo,
    });
    this.errores.set({});
    this.mostrarFormulario.set(true);
  }

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
        await this.clientesService.actualizar(editando.id, form);
      } else {
        await this.clientesService.crear(form);
      }
      this.alternarFormulario();
    } catch (e) {
      alert(mensajeDeError(e, 'Error al guardar el cliente.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async desactivar(cliente: Cliente): Promise<void> {
    const confirmado = confirm(
      `¿Desactivar al cliente "${cliente.nombre}"?\n\n` +
      'No se borran sus órdenes; solo deja de aparecer en la lista.'
    );
    if (!confirmado) return;

    this.guardando.set(true);
    try {
      await this.clientesService.desactivar(cliente.id);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al eliminar el cliente.'));
    } finally {
      this.guardando.set(false);
    }
  }

  async verDetalle(cliente: Cliente): Promise<void> {
    try {
      const [ficha, resumen] = await Promise.all([
        this.clientesService.obtenerFicha(cliente.id),
        this.clientesService.obtenerResumen(cliente.id),
      ]);
      this.detalle.set(ficha);
      this.resumen.set(resumen);
    } catch (e) {
      alert(mensajeDeError(e, 'No se pudo cargar el detalle del cliente.'));
    }
  }

  cerrarDetalle(): void {
    this.detalle.set(null);
    this.resumen.set(null);
  }
}
