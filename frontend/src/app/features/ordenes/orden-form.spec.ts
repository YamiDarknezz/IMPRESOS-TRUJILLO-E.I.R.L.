import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { ClientesService } from '../../core/services/clientes.service';
import { InventarioService } from '../../core/services/inventario.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { ProductosService } from '../../core/services/productos.service';
import { SesionService } from '../../core/services/sesion.service';
import { OrdenFormComponent } from './orden-form';
import { Cliente, MaterialInventario, Orden, Producto } from '../../core/models';

const clientePersona: Cliente = {
  id: 1, nombre: 'Juan Pérez', tipo: 'persona', documento: '1', telefono: '999',
  email: '', direccion: 'Av. 1', notas: '', es_corporativo: false,
};
const clienteCorporativo: Cliente = { ...clientePersona, id: 2, nombre: 'Empresa SAC', es_corporativo: true };

const material: MaterialInventario = {
  id: 1, nombre: 'Lona banner 13 oz', unidad_id: 1, unidad: 'm2', stock_actual: 100, alerta_minima: 10,
};

const producto: Producto = {
  id: 1, nombre: 'Banner 1x1', tipo: 'propio', precio_base: 80, notas: '',
  materiales: [{ id_material: 1, nombre: 'Lona banner 13 oz', cantidad: 1, unidad: 'm2' }],
};

function ordenExistente(sobrescribe: Partial<Orden> = {}): Orden {
  return {
    id: 9,
    id_documento: 'C-0009',
    codigo: 'C-0009',
    tipo_documento: 'contrato',
    unidad_negocio: 'imprenta',
    cliente_id: 1,
    cliente: 'Juan Pérez',
    direccion: '',
    telefono: '',
    descripcion: 'Banners',
    estado: 'pendiente',
    fecha_creacion: '2026-09-01',
    fecha_entrega: '2026-12-31',
    creado_por: 1,
    asignado_a: null,
    asignado: '',
    incluye_igv: false,
    subtotal: 100,
    igv: 0,
    items: [],
    ...sobrescribe,
  };
}

describe('OrdenFormComponent', () => {
  let clientesFalso: { clientes: ReturnType<typeof signal<Cliente[]>>; cargar: ReturnType<typeof vi.fn>; crear: ReturnType<typeof vi.fn> };
  let inventarioFalso: { materiales: ReturnType<typeof signal<MaterialInventario[]>>; cargar: ReturnType<typeof vi.fn> };
  let productosFalso: { productos: ReturnType<typeof signal<Producto[]>>; cargar: ReturnType<typeof vi.fn> };
  let ordenesFalso: {
    ordenes: ReturnType<typeof signal<Orden[]>>;
    cargar: ReturnType<typeof vi.fn>;
    crear: ReturnType<typeof vi.fn>;
    actualizar: ReturnType<typeof vi.fn>;
  };
  let sesionFalsa: { esSupervisor: ReturnType<typeof signal<boolean>> };
  let routerFalso: { navigate: ReturnType<typeof vi.fn> };

  function configurar(idRuta: string | null = null) {
    clientesFalso = { clientes: signal([clientePersona, clienteCorporativo]), cargar: vi.fn().mockResolvedValue(undefined), crear: vi.fn() };
    inventarioFalso = { materiales: signal([material]), cargar: vi.fn().mockResolvedValue(undefined) };
    productosFalso = { productos: signal([producto]), cargar: vi.fn().mockResolvedValue(undefined) };
    ordenesFalso = {
      ordenes: signal([ordenExistente()]),
      cargar: vi.fn().mockResolvedValue(undefined),
      crear: vi.fn().mockResolvedValue(undefined),
      actualizar: vi.fn().mockResolvedValue(undefined),
    };
    sesionFalsa = { esSupervisor: signal(true) };
    routerFalso = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      imports: [OrdenFormComponent],
      providers: [
        { provide: ClientesService, useValue: clientesFalso },
        { provide: InventarioService, useValue: inventarioFalso },
        { provide: ProductosService, useValue: productosFalso },
        { provide: OrdenesService, useValue: ordenesFalso },
        { provide: SesionService, useValue: sesionFalsa },
        { provide: Router, useValue: routerFalso },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => idRuta } } } },
      ],
    });
  }

  beforeEach(() => configurar(null));

  it('sin id en la ruta (orden nueva), no entra en modo edición', () => {
    const fixture = TestBed.createComponent(OrdenFormComponent);
    expect(fixture.componentInstance.editando()).toBeNull();
  });

  describe('modo edición', () => {
    it('con un id que existe, precarga el formulario con los datos de la orden', async () => {
      configurar('9');
      const fixture = TestBed.createComponent(OrdenFormComponent);
      await Promise.resolve(); // deja que prepararEdicion() resuelva su await interno
      await Promise.resolve();

      expect(fixture.componentInstance.editando()?.id).toBe(9);
      expect(fixture.componentInstance.form().descripcion).toBe('Banners');
    });

    it('con un id que no existe en la lista, vuelve a /ordenes', async () => {
      configurar('999');
      TestBed.createComponent(OrdenFormComponent);
      await Promise.resolve();
      await Promise.resolve();

      expect(routerFalso.navigate).toHaveBeenCalledWith(['/ordenes']);
    });
  });

  describe('cálculo de totales', () => {
    it('sin líneas, el subtotal sale del precio total directo', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      fixture.componentInstance.actualizar('precioTotal', 100);
      expect(fixture.componentInstance.subtotal()).toBe(100);
    });

    it('con líneas, el subtotal es la suma de cantidad × precio unitario', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.agregarLinea();
      componente.actualizarLinea(0, 'cantidad', 2);
      componente.actualizarLinea(0, 'precioUnitario', 30);
      expect(componente.subtotal()).toBe(60);
      expect(componente.importeLinea(componente.form().lineas[0])).toBe(60);
    });

    it('el IGV solo se aplica si incluyeIgv está activo', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('precioTotal', 100);
      expect(componente.igv()).toBe(0);
      componente.actualizar('incluyeIgv', true);
      expect(componente.igv()).toBe(18);
      expect(componente.total()).toBe(118);
    });

    it('el descuento se resta del total, y el saldo nunca baja de 0', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('precioTotal', 100);
      componente.actualizar('descuento', 20);
      componente.actualizar('adelanto', 200);
      expect(componente.total()).toBe(80);
      expect(componente.saldoPendiente()).toBe(0);
    });

    it('adelantoMinimo(): 50% del total para clientes generales, 0 para corporativos', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('precioTotal', 100);
      componente.actualizar('clienteId', 1);
      expect(componente.adelantoMinimo()).toBe(50);
      componente.actualizar('clienteId', 2);
      expect(componente.adelantoMinimo()).toBe(0);
    });
  });

  describe('producto del catálogo', () => {
    it('aplicarProducto(): autocompleta descripción, precio y materiales', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      fixture.componentInstance.aplicarProducto('1');
      const f = fixture.componentInstance.form();
      expect(f.descripcion).toBe('Banner 1x1');
      expect(f.precioTotal).toBe(80);
      expect(f.materiales).toEqual([{ id_material: 1, nombre: 'Lona banner 13 oz', cantidad: 1, unidad: 'm2' }]);
    });

    it('aplicarProducto(""): vuelve a "Personalizado" y limpia lo autocompletado', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      fixture.componentInstance.aplicarProducto('1');
      fixture.componentInstance.aplicarProducto('');
      const f = fixture.componentInstance.form();
      expect(f.descripcion).toBe('');
      expect(f.precioTotal).toBe(0);
      expect(f.materiales).toEqual([]);
    });
  });

  describe('materiales estimados', () => {
    it('agregarMaterial(): agrega el material elegido', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.materialSelId.set('1');
      componente.materialSelCantidad.set(3);
      componente.agregarMaterial();
      expect(componente.form().materiales).toEqual([
        { id_material: 1, nombre: 'Lona banner 13 oz', cantidad: 3, unidad: 'm2' },
      ]);
    });

    it('quitarMaterial(): elimina por índice', () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.materialSelId.set('1');
      componente.agregarMaterial();
      componente.quitarMaterial(0);
      expect(componente.form().materiales).toEqual([]);
    });
  });

  describe('alta rápida de cliente', () => {
    it('sin nombre, no llama al servicio', async () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      await fixture.componentInstance.crearClienteRapido();
      expect(clientesFalso.crear).not.toHaveBeenCalled();
    });

    it('con nombre, crea el cliente y lo deja seleccionado en el formulario', async () => {
      clientesFalso.crear.mockResolvedValue(5);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.nuevoCliente.set({ nombre: 'Cliente Nuevo', telefono: '555' });

      await componente.crearClienteRapido();

      expect(clientesFalso.crear).toHaveBeenCalledWith({ nombre: 'Cliente Nuevo', telefono: '555' });
      expect(componente.form().clienteId).toBe(5);
      expect(componente.mostrarNuevoCliente()).toBe(false);
    });
  });

  describe('guardar()', () => {
    it('exige cliente, descripción, fecha de entrega y un total mayor a 0', async () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      await fixture.componentInstance.guardar();
      const errores = fixture.componentInstance.errores();
      expect(errores['cliente']).toBeTruthy();
      expect(errores['descripcion']).toBeTruthy();
      expect(errores['fechaEntrega']).toBeTruthy();
      expect(errores['precioTotal']).toBeTruthy();
      expect(ordenesFalso.crear).not.toHaveBeenCalled();
    });

    it('RN-01: sin adelanto, lo exige para clientes no corporativos (con el mínimo del 50%)', async () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);

      await componente.guardar();

      // Ambas reglas de "adelanto" se evalúan y la del mínimo (0 < 50) es la
      // que queda como mensaje final, por ir después en `validar()`.
      expect(componente.errores()['adelanto']).toContain('S/ 50.00');
      expect(ordenesFalso.crear).not.toHaveBeenCalled();
    });

    it('RN-01: con adelanto insuficiente (menos del 50%), exige el mínimo', async () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 10);

      await componente.guardar();

      expect(componente.errores()['adelanto']).toContain('S/ 50.00');
      expect(ordenesFalso.crear).not.toHaveBeenCalled();
    });

    it('un cliente corporativo no necesita adelanto', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 2); // corporativo
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);

      await componente.guardar();

      expect(componente.errores()['adelanto']).toBeUndefined();
      expect(ordenesFalso.crear).toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('orden nueva: pide confirmación antes de crear', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 2);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);

      await componente.guardar();

      expect(ordenesFalso.crear).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('con datos válidos, crea la orden y vuelve a /ordenes', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 2);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);

      await componente.guardar();

      expect(ordenesFalso.crear).toHaveBeenCalledWith(
        expect.objectContaining({ cliente: 'Empresa SAC', descripcion: 'Banners', adelanto_pago: 0 }),
      );
      expect(routerFalso.navigate).toHaveBeenCalledWith(['/ordenes']);
      confirmSpy.mockRestore();
    });

    it('si no es supervisor, la asignación se ignora al guardar', async () => {
      sesionFalsa.esSupervisor.set(false);
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 2);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('asignadoA', 7);

      await componente.guardar();

      expect(ordenesFalso.crear).toHaveBeenCalledWith(expect.objectContaining({ asignado_a: null }));
      confirmSpy.mockRestore();
    });
  });

  it('volver() navega de vuelta a /ordenes', () => {
    const fixture = TestBed.createComponent(OrdenFormComponent);
    fixture.componentInstance.volver();
    expect(routerFalso.navigate).toHaveBeenCalledWith(['/ordenes']);
  });
});
