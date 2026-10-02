import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ClientesService } from '../../core/services/clientes.service';
import { ComprobantesService } from '../../core/services/comprobantes.service';
import { InventarioService } from '../../core/services/inventario.service';
import { DatosOrden, OrdenesService } from '../../core/services/ordenes.service';
import { ProductosService } from '../../core/services/productos.service';
import { SesionService, nombreVisible } from '../../core/services/sesion.service';
import {
  CanalIngreso,
  ETIQUETA_METODO,
  ETIQUETA_TIPO_DOCUMENTO,
  ETIQUETA_UNIDAD,
  MaterialItem,
  METODOS_PAGO,
  MetodoPago,
  Orden,
  TipoDocumento,
  UNIDADES_NEGOCIO,
  UnidadNegocio,
} from '../../core/models';
import { mensajeDeError } from '../../shared/utilidades/errores';
import {
  adelantoMinimoPorcentaje,
  canalesIngreso,
  etiquetasMetodo,
  igvPorcentaje,
  metodosPago as metodosDelServidor,
} from '../../core/estado/catalogos';
import {
  CapturaElegida,
  capturasDesdeArchivos,
  liberarCaptura,
  pesoLegible,
} from '../../shared/utilidades/imagenes';

/** Línea del contrato en el formulario. */
interface LineaFormulario {
  descripcion: string;
  anchoM: number | null;
  altoM: number | null;
  cantidad: number;
  precioUnitario: number;
}

/** Estado del formulario, en los términos en que lo llena el usuario. */
interface FormularioOrden {
  clienteId: number | null;
  cliente: string;
  asignadoA: number | null;
  productoId: number | null;
  descripcion: string;
  tipoDocumento: TipoDocumento;
  /** Vacío hasta que se elige: es un dato que después no se puede reconstruir (#69). */
  canalIngreso: CanalIngreso | '';
  unidadNegocio: UnidadNegocio;
  fechaEntrega: string;
  incluyeIgv: boolean;
  metodoPago: MetodoPago;
  precioTotal: number;
  adelanto: number;
  descuento: number;
  motivoDescuento: string;
  materiales: MaterialItem[];
  lineas: LineaFormulario[];
}

function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function lineaVacia(): LineaFormulario {
  return { descripcion: '', anchoM: null, altoM: null, cantidad: 1, precioUnitario: 0 };
}

function formularioVacio(): FormularioOrden {
  return {
    clienteId: null, cliente: '', asignadoA: null, productoId: null,
    descripcion: '', tipoDocumento: 'contrato', canalIngreso: '', unidadNegocio: 'imprenta',
    fechaEntrega: '', incluyeIgv: false, metodoPago: 'efectivo',
    precioTotal: 0, adelanto: 0, descuento: 0, motivoDescuento: '',
    materiales: [], lineas: [],
  };
}

import { IconComponent } from '../../shared/componentes/icon/icon.component';

@Component({
  selector: 'app-orden-form',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  templateUrl: './orden-form.html',
})
export class OrdenFormComponent {
  private ordenesService = inject(OrdenesService);
  private comprobantes = inject(ComprobantesService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);

  clientesService = inject(ClientesService);
  inventarioService = inject(InventarioService);
  productosService = inject(ProductosService);
  sesion = inject(SesionService);

  readonly clientes = this.clientesService.clientes;
  readonly materiales = this.inventarioService.materiales;
  readonly productos = this.productosService.productos;

  readonly form = signal<FormularioOrden>(formularioVacio());
  readonly editando = signal<Orden | null>(null);
  readonly errores = signal<Record<string, string>>({});
  readonly guardando = signal(false);

  // Selector de material a añadir
  readonly materialSelId = signal('');
  readonly materialSelCantidad = signal(1);

  // Alta rápida de cliente sin salir del formulario
  readonly mostrarNuevoCliente = signal(false);
  readonly nuevoCliente = signal({ nombre: '', telefono: '' });

  // Catálogos para la plantilla
  readonly metodosPago = metodosDelServidor;
  readonly canales = computed(() => canalesIngreso());
  readonly igvPorcentaje = igvPorcentaje;
  readonly adelantoPorcentaje = adelantoMinimoPorcentaje;
  readonly unidadesNegocio = UNIDADES_NEGOCIO;
  readonly tiposDocumento: TipoDocumento[] = ['contrato', 'proforma'];
  readonly etiquetaMetodo = etiquetasMetodo;
  readonly etiquetaUnidad = ETIQUETA_UNIDAD;
  readonly etiquetaTipoDocumento = ETIQUETA_TIPO_DOCUMENTO;
  readonly nombreVisible = nombreVisible;

  /** Cliente elegido: define si aplica el adelanto mínimo (RN-01). */
  readonly clienteSeleccionado = computed(() =>
    this.clientes().find(c => c.id === this.form().clienteId) ?? null
  );

  /**
   * Subtotal: sale de las líneas si las hay; si no, del total directo.
   *
   * Cada línea se redondea a centavos antes de sumar, igual que
   * `_calcular_subtotal()` del backend: sumando en crudo, una línea con
   * fracción de centavo (cantidad decimal × precio) daba un subtotal distinto
   * al que queda guardado (#53).
   */
  readonly subtotal = computed(() => {
    const f = this.form();
    if (f.lineas.length > 0) {
      return redondear(
        f.lineas.reduce(
          (suma, linea) => suma + redondear(linea.cantidad * linea.precioUnitario),
          0
        )
      );
    }
    return redondear(f.precioTotal);
  });

  readonly igv = computed(() =>
    this.form().incluyeIgv ? redondear(this.subtotal() * igvPorcentaje() / 100) : 0
  );

  readonly total = computed(() =>
    redondear(this.subtotal() + this.igv() - this.form().descuento)
  );

  readonly saldoPendiente = computed(() =>
    Math.max(redondear(this.total() - this.form().adelanto), 0)
  );

  /** Adelanto mínimo exigido para clientes no corporativos. */
  readonly adelantoMinimo = computed(() => {
    if (this.clienteSeleccionado()?.es_corporativo) return 0;
    return redondear(this.total() * adelantoMinimoPorcentaje() / 100);
  });

  constructor() {
    // Los catálogos se cargan en paralelo; si ya están en caché no se repiten.
    this.clientesService.cargar();
    this.inventarioService.cargar();
    this.productosService.cargar();
    this.ordenesService.cargar();

    const id = this.ruta.snapshot.paramMap.get('id');
    if (id) this.prepararEdicion(Number(id));
  }

  private readonly ordenes = this.ordenesService.ordenes;

  /**
   * Carga en el formulario la orden a editar. Puede entrarse por enlace
   * directo con la lista aún sin cargar, así que se espera a tenerla.
   */
  private async prepararEdicion(id: number): Promise<void> {
    await this.ordenesService.cargar();
    const orden = this.ordenes().find(o => o.id === id);

    if (!orden) {
      this.router.navigate(['/ordenes']);
      return;
    }

    this.editando.set(orden);
    this.form.set({
      clienteId: orden.cliente_id ?? null,
      cliente: orden.cliente,
      asignadoA: orden.asignado_a ?? null,
      productoId: null,
      descripcion: orden.descripcion,
      tipoDocumento: orden.tipo_documento,
      canalIngreso: orden.canal_ingreso,
      unidadNegocio: orden.unidad_negocio,
      fechaEntrega: orden.fecha_entrega,
      incluyeIgv: orden.incluye_igv,
      metodoPago: orden.finanzas?.metodo_pago_adelanto ?? 'efectivo',
      precioTotal: orden.items?.length ? 0 : orden.subtotal,
      adelanto: orden.finanzas?.adelanto_pago ?? 0,
      descuento: orden.finanzas?.descuento ?? 0,
      motivoDescuento: orden.finanzas?.motivo_descuento ?? '',
      materiales: (orden.materiales?.estimados ?? []).map(m => ({ ...m })),
      lineas: (orden.items ?? []).map(item => ({
        descripcion: item.descripcion,
        anchoM: item.ancho_m ?? null,
        altoM: item.alto_m ?? null,
        cantidad: item.cantidad,
        precioUnitario: item.precio_unitario,
      })),
    });
  }

  /** Actualiza un campo del formulario y limpia su mensaje de error. */
  actualizar<K extends keyof FormularioOrden>(campo: K, valor: FormularioOrden[K]): void {
    this.form.update(f => ({ ...f, [campo]: valor }));
    if (this.errores()[campo]) {
      this.errores.update(e => ({ ...e, [campo]: '' }));
    }
  }

  // ── Producto del catálogo ────────────────────────────────────────────────

  /**
   * Autocompleta descripción, precio y materiales al elegir un producto.
   * Si se vuelve a "Personalizado", limpia lo que había autocompletado.
   */
  aplicarProducto(valor: string): void {
    const idProducto = valor ? Number(valor) : null;
    this.actualizar('productoId', idProducto);
    const producto = this.productos().find(p => p.id === idProducto);

    if (!producto) {
      this.form.update(f => ({ ...f, descripcion: '', precioTotal: 0, materiales: [] }));
      return;
    }

    this.form.update(f => ({
      ...f,
      descripcion: producto.nombre,
      precioTotal: f.lineas.length > 0 ? f.precioTotal : producto.precio_base,
      materiales: producto.materiales?.length
        ? producto.materiales.map(m => ({ ...m }))
        : f.materiales,
    }));
    this.errores.update(e => ({ ...e, descripcion: '' }));
  }

  // ── Líneas del contrato (medidas para gran formato) ──────────────────────

  agregarLinea(): void {
    this.form.update(f => ({ ...f, lineas: [...f.lineas, lineaVacia()] }));
  }

  actualizarLinea<K extends keyof LineaFormulario>(indice: number, campo: K, valor: LineaFormulario[K]): void {
    this.form.update(f => ({
      ...f,
      lineas: f.lineas.map((linea, i) => (i === indice ? { ...linea, [campo]: valor } : linea)),
    }));
  }

  quitarLinea(indice: number): void {
    this.form.update(f => ({ ...f, lineas: f.lineas.filter((_, i) => i !== indice) }));
  }

  /** Importe de una línea, para mostrarlo en la tabla. */
  importeLinea(linea: LineaFormulario): number {
    return redondear(linea.cantidad * linea.precioUnitario);
  }

  // ── Materiales estimados ─────────────────────────────────────────────────

  agregarMaterial(): void {
    const material = this.materiales().find(m => String(m.id) === this.materialSelId());
    const cantidad = this.materialSelCantidad();
    if (!material || cantidad <= 0) return;

    this.form.update(f => {
      const yaEsta = f.materiales.some(m => m.id_material === material.id);
      const materiales = yaEsta
        // Si el material ya está en la lista, se suma a su cantidad en vez de
        // duplicar la fila.
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

  // ── Alta rápida de cliente ───────────────────────────────────────────────

  async crearClienteRapido(): Promise<void> {
    const datos = this.nuevoCliente();
    if (!datos.nombre.trim()) return;

    this.guardando.set(true);
    try {
      const id = await this.clientesService.crear({
        nombre: datos.nombre.trim(),
        telefono: datos.telefono,
      });
      this.actualizar('clienteId', id);
      this.actualizar('cliente', datos.nombre.trim());
      this.nuevoCliente.set({ nombre: '', telefono: '' });
      this.mostrarNuevoCliente.set(false);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al crear el cliente.'));
    } finally {
      this.guardando.set(false);
    }
  }

  // ── Guardar ──────────────────────────────────────────────────────────────

  private validar(form: FormularioOrden): Record<string, string> {
    const errores: Record<string, string> = {};

    if (!form.clienteId && !form.cliente.trim()) {
      errores['cliente'] = 'Selecciona un cliente.';
    }
    if (!form.descripcion.trim()) {
      errores['descripcion'] = 'La descripción es requerida.';
    }
    if (!form.canalIngreso) {
      errores['canalIngreso'] = 'Indica por qué vía llegó el pedido.';
    }
    if (!form.fechaEntrega) {
      errores['fechaEntrega'] = 'La fecha de entrega es requerida.';
    }
    if (form.lineas.length > 0 && form.lineas.some(l => !l.descripcion.trim())) {
      errores['lineas'] = 'Completa la descripción de todas las líneas.';
    }
    if (form.lineas.length === 0 && !(form.precioTotal > 0)) {
      errores['precioTotal'] = 'Ingresa el total o agrega líneas al contrato.';
    }
    // #30: la misma regla que aplica el backend (`calcular_totales`), para no
    // llegar a confirmar un total negativo que después se rechaza al guardar.
    if (form.descuento > this.subtotal()) {
      errores['descuento'] = 'El descuento no puede superar el subtotal.';
    }
    // RN-01: sin adelanto no se arranca el trabajo.
    if (!(form.adelanto > 0) && !this.clienteSeleccionado()?.es_corporativo) {
      errores['adelanto'] = 'Se requiere un adelanto para iniciar el trabajo.';
    }
    if (form.adelanto < this.adelantoMinimo()) {
      errores['adelanto'] =
        `El adelanto mínimo para clientes generales es S/ ${this.adelantoMinimo().toFixed(2)}.`;
    }
    return errores;
  }

  // ── Capturas del adelanto (RF-11) ───────────────────────────────────────
  // Se adjuntan al guardar, no antes: la orden todavía no existe. Son
  // opcionales; el trabajo se puede registrar sin la captura a mano.

  readonly adjuntos = signal<CapturaElegida[]>([]);

  agregarAdjuntos(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const { aceptadas, rechazadas } = capturasDesdeArchivos(entrada.files);
    entrada.value = ''; // permite volver a elegir el mismo archivo

    if (rechazadas > 0) {
      alert('Solo se aceptan capturas en JPG, PNG o WebP, o un PDF.');
    }
    this.adjuntos.update(actuales => [...actuales, ...aceptadas]);
  }

  quitarAdjunto(indice: number): void {
    const adjunto = this.adjuntos()[indice];
    if (adjunto) liberarCaptura(adjunto);
    this.adjuntos.update(actuales => actuales.filter((_, posicion) => posicion !== indice));
  }

  readonly pesoLegible = pesoLegible;

  async guardar(): Promise<void> {
    const form = { ...this.form() };

    // El nombre del cliente se deriva del seleccionado en la lista.
    const cliente = this.clientes().find(c => c.id === form.clienteId);
    if (cliente) form.cliente = cliente.nombre;

    const errores = this.validar(form);
    this.errores.set(errores);
    if (Object.keys(errores).length > 0) return;

    const editando = this.editando();
    if (!editando) {
      const confirmado = confirm(
        `¿Crear ${form.tipoDocumento} para "${form.cliente}" por un total de S/ ${this.total().toFixed(2)}?`
      );
      if (!confirmado) return;
    }

    const datos: DatosOrden = {
      cliente_id: form.clienteId,
      cliente: form.cliente,
      direccion: cliente?.direccion ?? '',
      telefono: cliente?.telefono ?? '',
      asignado_a: this.sesion.esSupervisor() ? form.asignadoA : null,
      descripcion: form.descripcion,
      tipo_documento: form.tipoDocumento,
      canal_ingreso: form.canalIngreso as CanalIngreso,
      unidad_negocio: form.unidadNegocio,
      fecha_entrega: form.fechaEntrega,
      incluye_igv: form.incluyeIgv,
      items: form.lineas.map(l => ({
        descripcion: l.descripcion,
        ancho_m: l.anchoM,
        alto_m: l.altoM,
        cantidad: l.cantidad,
        precio_unitario: l.precioUnitario,
      })),
      materiales_estimados: form.materiales.map(m => ({
        material_id: m.id_material,
        cantidad: m.cantidad,
      })),
      descuento: form.descuento,
      motivo_descuento: form.motivoDescuento,
      precio_total: form.lineas.length > 0 ? null : form.precioTotal,
      adelanto_pago: form.adelanto,
      metodo_pago: form.metodoPago,
    };

    this.guardando.set(true);
    try {
      let idOrden: number;
      if (editando) {
        await this.ordenesService.actualizar(editando.id, datos);
        idOrden = editando.id;
      } else {
        // La orden se crea primero: la captura necesita a quién pertenecer.
        idOrden = (await this.ordenesService.crear(datos)).id;
      }

      const pendientes = this.adjuntos();
      if (pendientes.length > 0) {
        const { subidos, fallidos } = await this.comprobantes.subirVarias(
          idOrden,
          pendientes.map(adjunto => adjunto.archivo)
        );
        pendientes.filter(adjunto => subidos.length > 0).forEach(liberarCaptura);
        this.adjuntos.set(subidos.length > 0 ? [] : pendientes);

        if (fallidos.length > 0) {
          // La orden ya está guardada: se avisa qué quedó pendiente en lugar de
          // perder el formulario entero por una foto.
          alert(
            'La orden se guardó, pero estas capturas no subieron:\n' +
              fallidos.map(fallo => `• ${fallo.nombre}: ${fallo.motivo}`).join('\n')
          );
        }
      }
      this.router.navigate(['/ordenes']);
    } catch (e) {
      alert(mensajeDeError(e, 'Error al guardar la orden.'));
    } finally {
      this.guardando.set(false);
    }
  }

  volver(): void {
    this.router.navigate(['/ordenes']);
  }
}
