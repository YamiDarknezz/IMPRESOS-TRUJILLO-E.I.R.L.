import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { signal } from '@angular/core';
import { ClientesService } from '../../core/services/clientes.service';
import { InventarioService } from '../../core/services/inventario.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { ComprobantesService } from '../../core/services/comprobantes.service';
import { ProductosService } from '../../core/services/productos.service';
import { SesionService } from '../../core/services/sesion.service';
import { OrdenFormComponent } from './orden-form';
import { Cliente, MaterialInventario, Orden, PiezaLoteMaterial, Producto } from '../../core/models';
import { hidratarConfiguracion, reiniciarConfiguracion } from '../../core/estado/catalogos';
import { CATALOGOS_DE_PRUEBA, PARAMETROS_DE_PRUEBA } from '../../core/estado/catalogos.prueba';

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
    canal_ingreso: 'otro',
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
  let inventarioFalso: { materiales: ReturnType<typeof signal<MaterialInventario[]>>; cargar: ReturnType<typeof vi.fn>; listarPiezas: ReturnType<typeof vi.fn> };
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
    inventarioFalso = {
      materiales: signal([material]),
      cargar: vi.fn().mockResolvedValue(undefined),
      listarPiezas: vi.fn().mockResolvedValue([]),
    };
    productosFalso = { productos: signal([producto]), cargar: vi.fn().mockResolvedValue(undefined) };
    ordenesFalso = {
      ordenes: signal([ordenExistente()]),
      cargar: vi.fn().mockResolvedValue(undefined),
      // `crear` devuelve la orden: el formulario la necesita para adjuntar
      // las capturas del adelanto (RF-11).
      crear: vi.fn().mockResolvedValue({ id: 7 }),
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
        {
          provide: ComprobantesService,
          useValue: { subirVarias: vi.fn().mockResolvedValue({ subidos: [], fallidos: [] }) },
        },
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

    // #53: la interfaz y el backend tienen que dar el mismo céntimo. Con
    // 38,25 de subtotal el IGV cae justo en medio centavo (6,885), y antes la
    // UI mostraba y confirmaba 6,89 mientras se guardaba 6,88.
    it('el medio centavo del IGV se redondea hacia arriba, como el backend', () => {
      const componente = TestBed.createComponent(OrdenFormComponent).componentInstance;
      componente.agregarLinea();
      componente.actualizarLinea(0, 'cantidad', 2);
      componente.actualizarLinea(0, 'precioUnitario', 15.5);
      componente.agregarLinea();
      componente.actualizarLinea(1, 'cantidad', 1);
      componente.actualizarLinea(1, 'precioUnitario', 7.25);
      componente.actualizar('incluyeIgv', true);

      expect(componente.subtotal()).toBe(38.25);
      expect(componente.igv()).toBe(6.89);
      expect(componente.total()).toBe(45.14);
    });

    it('cada línea se redondea a centavos antes de sumar, como el backend', () => {
      const componente = TestBed.createComponent(OrdenFormComponent).componentInstance;
      for (let i = 0; i < 4; i++) {
        componente.agregarLinea();
        componente.actualizarLinea(i, 'cantidad', 1);
        componente.actualizarLinea(i, 'precioUnitario', 2.4975);
      }

      // Sumando en crudo da 9,99; el backend redondea cada línea (2,50) y
      // guarda 10,00.
      expect(componente.subtotal()).toBe(10);
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
    // Issue #109: al elegir material se ve dónde está guardado.
    it('ubicacionDe() devuelve dónde está el material, o vacío si no se registró', () => {
      const componente = TestBed.createComponent(OrdenFormComponent).componentInstance;
      inventarioFalso.materiales.set([{ ...material, ubicacion_estante: ' Estante 2 ' }, { ...material, id: 2 }]);

      expect(componente.ubicacionDe(1)).toBe('Estante 2');
      expect(componente.ubicacionDe(2)).toBe('');
      expect(componente.ubicacionDe(99)).toBe('');
    });

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

    // Issue #69: el canal es un dato que después no se puede reconstruir.
    it('exige elegir el canal por el que entró el pedido', async () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      await fixture.componentInstance.guardar();
      expect(fixture.componentInstance.errores()['canalIngreso']).toBeTruthy();
    });

    it('con el canal elegido, no hay error de canal y viaja en el pedido', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'llamada');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 50);

      await componente.guardar();

      expect(componente.errores()['canalIngreso']).toBeUndefined();
      expect(ordenesFalso.crear).toHaveBeenCalledWith(expect.objectContaining({ canal_ingreso: 'llamada' }));
      confirmSpy.mockRestore();
    });

    // Issue #110
    it('la descripción del adelanto viaja recortada en el pedido', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const componente = TestBed.createComponent(OrdenFormComponent).componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 50);
      componente.actualizar('adelantoDescripcion', '  Para el diseño ');

      await componente.guardar();

      expect(ordenesFalso.crear).toHaveBeenCalledWith(
        expect.objectContaining({ adelanto_descripcion: 'Para el diseño' })
      );
      confirmSpy.mockRestore();
    });

    // #30: el backend rechaza un descuento mayor al subtotal; la interfaz ahora
    // lo dice antes, en vez de mostrar el total negativo y fallar al guardar.
    it('un descuento mayor al subtotal se marca en el formulario', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 50);
      componente.actualizar('descuento', 150);

      await componente.guardar();

      expect(componente.errores()['descuento']).toBe('El descuento no puede superar el subtotal.');
      // No se llega a confirmar un total negativo ni a llamar al backend.
      expect(confirmSpy).not.toHaveBeenCalled();
      expect(ordenesFalso.crear).not.toHaveBeenCalled();
    });

    it('un descuento igual al subtotal se permite (solo queda el IGV)', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 50);
      componente.actualizar('descuento', 100);

      await componente.guardar();

      expect(componente.errores()['descuento']).toBeUndefined();
      expect(ordenesFalso.crear).toHaveBeenCalled();
    });

    it('RN-01: sin adelanto, lo exige para clientes no corporativos (con el mínimo del 50%)', async () => {
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
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
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 10);

      await componente.guardar();

      expect(componente.errores()['adelanto']).toContain('S/ 50.00');
      expect(ordenesFalso.crear).not.toHaveBeenCalled();
    });

    // Issue #72: la proforma es el documento de los clientes de confianza y de los
    // que pagan a plazo; no exige adelanto, el contrato sí.
    it('una proforma no necesita adelanto, aunque el cliente no sea corporativo', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      const componente = TestBed.createComponent(OrdenFormComponent).componentInstance;
      componente.actualizar('clienteId', 1); // persona
      componente.actualizar('tipoDocumento', 'proforma');
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'llamada');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 0);

      await componente.guardar();

      expect(componente.exentoDeAdelanto()).toBe(true);
      expect(componente.adelantoMinimo()).toBe(0);
      expect(componente.errores()['adelanto']).toBeUndefined();
      expect(ordenesFalso.crear).toHaveBeenCalledWith(expect.objectContaining({ tipo_documento: 'proforma', adelanto_pago: 0 }));
    });

    it('un contrato sigue exigiendo el adelanto mínimo', async () => {
      const componente = TestBed.createComponent(OrdenFormComponent).componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('tipoDocumento', 'contrato');
      componente.actualizar('precioTotal', 100);

      expect(componente.exentoDeAdelanto()).toBe(false);
      expect(componente.adelantoMinimo()).toBe(50);
    });

    it('un cliente corporativo no necesita adelanto', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('clienteId', 2); // corporativo
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
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
      componente.actualizar('canalIngreso', 'whatsapp');
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
      componente.actualizar('canalIngreso', 'whatsapp');
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
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('asignadoA', 7);

      await componente.guardar();

      expect(ordenesFalso.crear).toHaveBeenCalledWith(expect.objectContaining({ asignado_a: null }));
      confirmSpy.mockRestore();
    });
  });

  // Issue #124: el adelanto repartido en varios métodos (S/ 100 en efectivo y S/ 50 por Yape).
  describe('adelanto repartido (#124)', () => {
    beforeEach(() => {
      hidratarConfiguracion({ parametros: PARAMETROS_DE_PRUEBA, catalogos: CATALOGOS_DE_PRUEBA });
    });
    afterEach(() => reiniciarConfiguracion());

    function formularioListo(precioTotal = 300) {
      const componente = TestBed.createComponent(OrdenFormComponent).componentInstance;
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', precioTotal);
      return componente;
    }

    it('agregar otro método suma una parte con el primer método que no se usa', () => {
      const componente = formularioListo();
      componente.actualizar('adelanto', 100);

      componente.agregarParteAdelanto();

      expect(componente.form().adelantoExtra).toEqual([
        { metodo: 'yape_marcell', monto: 0, descripcion: '' },
      ]);
    });

    it('el total del adelanto es la suma de las partes y descuenta del saldo', () => {
      const componente = formularioListo(300);
      componente.actualizar('adelanto', 100);
      componente.agregarParteAdelanto();
      componente.actualizarParteAdelanto(0, 'monto', 50);

      expect(componente.adelantoTotal()).toBe(150);
      expect(componente.saldoPendiente()).toBe(150);
    });

    it('no se repite un método: cada selector ofrece solo los que no usa otra parte', () => {
      const componente = formularioListo();
      componente.agregarParteAdelanto();

      expect(componente.metodosDeLaParte(0)).not.toContain('efectivo');
      expect(componente.metodosDeLaParte(0)).toContain('yape_marcell');
      expect(componente.metodosPrimeraParte()).not.toContain('yape_marcell');
      expect(componente.metodosPrimeraParte()).toContain('efectivo');
    });

    it('cuando ya se usaron todos los métodos no se puede agregar otra parte', () => {
      const componente = formularioListo();
      expect(componente.puedeAgregarParte()).toBe(true);

      componente.agregarParteAdelanto();
      componente.agregarParteAdelanto();
      componente.agregarParteAdelanto();

      expect(componente.form().adelantoExtra.length).toBe(3);
      expect(componente.puedeAgregarParte()).toBe(false);
    });

    it('quitar una parte la saca del adelanto', () => {
      const componente = formularioListo();
      componente.agregarParteAdelanto();
      componente.actualizarParteAdelanto(0, 'monto', 40);

      componente.quitarParteAdelanto(0);

      expect(componente.form().adelantoExtra).toEqual([]);
      expect(componente.adelantoTotal()).toBe(0);
    });

    it('el adelanto mínimo se valida sobre la suma de las partes', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const componente = formularioListo(400); // mínimo 50 % = 200
      componente.actualizar('adelanto', 100);
      componente.agregarParteAdelanto();
      componente.actualizarParteAdelanto(0, 'monto', 50);

      await componente.guardar();
      expect(componente.errores()['adelanto']).toContain('200.00');
      expect(ordenesFalso.crear).not.toHaveBeenCalled();

      componente.actualizarParteAdelanto(0, 'monto', 100);
      await componente.guardar();
      expect(componente.errores()['adelanto']).toBeUndefined();
      expect(ordenesFalso.crear).toHaveBeenCalledTimes(1);
      confirmSpy.mockRestore();
    });

    it('una parte en cero se rechaza', async () => {
      const componente = formularioListo();
      componente.actualizar('adelanto', 200);
      componente.agregarParteAdelanto();

      await componente.guardar();

      expect(componente.errores()['adelantoPartes']).toBeTruthy();
      expect(ordenesFalso.crear).not.toHaveBeenCalled();
    });

    it('al guardar manda las partes, la suma como adelanto y el método de la parte más grande', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const componente = formularioListo(300);
      componente.actualizar('adelanto', 100);
      componente.agregarParteAdelanto();
      componente.actualizarParteAdelanto(0, 'metodo', 'yape_angel');
      componente.actualizarParteAdelanto(0, 'monto', 50);

      await componente.guardar();

      expect(ordenesFalso.crear).toHaveBeenCalledWith(
        expect.objectContaining({
          adelanto_pago: 150,
          metodo_pago: 'efectivo',
          adelanto_partes: [
            { metodo: 'efectivo', monto: 100, descripcion: '' },
            { metodo: 'yape_angel', monto: 50, descripcion: '' },
          ],
        })
      );
      confirmSpy.mockRestore();
    });

    it('con un solo método el envío es el de siempre, sin partes', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const componente = formularioListo(100);
      componente.actualizar('adelanto', 50);

      await componente.guardar();

      const enviado = ordenesFalso.crear.mock.calls[0][0];
      expect(enviado.adelanto_pago).toBe(50);
      expect('adelanto_partes' in enviado).toBe(false);
      confirmSpy.mockRestore();
    });

    it('al editar una orden con el adelanto repartido, carga cada parte', async () => {
      configurar('9');
      ordenesFalso.ordenes.set([
        ordenExistente({
          finanzas: {
            precio_total: 300, subtotal: 300, igv: 0, adelanto_pago: 150, saldo_pendiente: 150,
            metodo_pago_adelanto: 'efectivo', pagado_totalmente: false,
            pagos: [
              { id: 1, fecha: '2026-10-01', monto: 100, metodo: 'efectivo', tipo: 'adelanto', descripcion: 'Banners' },
              { id: 2, fecha: '2026-10-01', monto: 50, metodo: 'yape_angel', tipo: 'adelanto' },
              { id: 3, fecha: '2026-10-01', monto: 30, metodo: 'yape_marcell', tipo: 'adelanto', estado_pago: 'observado' },
            ],
          },
        }),
      ]);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      await Promise.resolve();
      await Promise.resolve();

      const f = fixture.componentInstance.form();
      expect(f.adelanto).toBe(100);
      expect(f.metodoPago).toBe('efectivo');
      expect(f.adelantoDescripcion).toBe('Banners');
      // El observado no es dinero recibido: no se carga como parte.
      expect(f.adelantoExtra).toEqual([{ metodo: 'yape_angel', monto: 50, descripcion: '' }]);
    });
  });

  // Issue #127: el rollo se elige al crear la orden y la orden le descuenta los metros.
  describe('rollo de cada material (#127)', () => {
    const rollo = (sobrescribe: Partial<PiezaLoteMaterial> = {}): PiezaLoteMaterial => ({
      id: 10, material_id: 1, codigo_identificador: 'UV-A', capacidad_inicial: 100, saldo_restante: 60,
      unidad_medida: 'ml', costo_adquisicion: 0, estado: 'disponible', ubicacion: '', maquina_asignada: '',
      fecha_ingreso: '2026-10-01', nota: '', total_recaudado: 0, ...sobrescribe,
    });

    async function conRollos(piezas: PiezaLoteMaterial[], idRuta: string | null = null) {
      configurar(idRuta);
      inventarioFalso.materiales.set([{ ...material, tipo_formato: 'continuo_rollo', unidad: 'ml' }]);
      inventarioFalso.listarPiezas.mockResolvedValue(piezas);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      await Promise.resolve();
      await Promise.resolve();
      return fixture.componentInstance;
    }

    it('un material de rollo se reconoce, y uno que no lo es no ofrece rollos', async () => {
      const componente = await conRollos([rollo()]);

      expect(componente.esDeRollo(1)).toBe(true);
      expect(componente.esDeRollo(99)).toBe(false);
    });

    it('solo ofrece los rollos de ese material que no están agotados', async () => {
      const componente = await conRollos([
        rollo({ id: 10 }),
        rollo({ id: 11, estado: 'agotado', saldo_restante: 0 }),
        rollo({ id: 12, material_id: 2 }),
      ]);

      expect(componente.rollosDe(1).map(p => p.id)).toEqual([10]);
    });

    it('al añadir un material de rollo sugiere el rollo en uso', async () => {
      const componente = await conRollos([rollo({ id: 10 }), rollo({ id: 11, estado: 'en_uso' })]);
      componente.materialSelId.set('1');
      componente.materialSelCantidad.set(2);

      componente.agregarMaterial();

      expect(componente.form().materiales[0].pieza_id).toBe(11);
    });

    it('elegir otro rollo, o ninguno, cambia el de la línea', async () => {
      const componente = await conRollos([rollo({ id: 10 }), rollo({ id: 11 })]);
      componente.materialSelId.set('1');
      componente.agregarMaterial();

      componente.elegirRollo(0, '11');
      expect(componente.form().materiales[0].pieza_id).toBe(11);

      componente.elegirRollo(0, '');
      expect(componente.form().materiales[0].pieza_id).toBeNull();
    });

    it('si pide más metros de los que le quedan al rollo, no guarda y dice cuánto queda', async () => {
      const componente = await conRollos([rollo({ id: 10, saldo_restante: 1.5 })]);
      componente.materialSelId.set('1');
      componente.materialSelCantidad.set(2);
      componente.agregarMaterial();
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 50);

      await componente.guardar();

      expect(componente.errores()['materiales']).toContain('1.5');
      expect(ordenesFalso.crear).not.toHaveBeenCalled();
    });

    it('al guardar manda el rollo de cada línea, y nada si no se eligió', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const componente = await conRollos([rollo({ id: 10 })]);
      componente.materialSelId.set('1');
      componente.materialSelCantidad.set(2);
      componente.agregarMaterial();
      componente.actualizar('clienteId', 1);
      componente.actualizar('descripcion', 'Banners');
      componente.actualizar('canalIngreso', 'whatsapp');
      componente.actualizar('fechaEntrega', '2026-12-31');
      componente.actualizar('precioTotal', 100);
      componente.actualizar('adelanto', 50);

      await componente.guardar();
      expect(ordenesFalso.crear).toHaveBeenLastCalledWith(
        expect.objectContaining({ materiales_estimados: [{ material_id: 1, cantidad: 2, pieza_id: 10 }] })
      );

      componente.elegirRollo(0, '');
      await componente.guardar();
      expect(ordenesFalso.crear).toHaveBeenLastCalledWith(
        expect.objectContaining({ materiales_estimados: [{ material_id: 1, cantidad: 2 }] })
      );
      confirmSpy.mockRestore();
    });

    it('al editar, lo que la orden ya le descontó al rollo cuenta como disponible', async () => {
      const componente = await conRollos(
        [rollo({ id: 10, saldo_restante: 3 })], // al rollo le quedan 3 porque esta orden ya se llevó 5
        '9'
      );
      ordenesFalso.ordenes.set([
        ordenExistente({
          materiales: {
            estimados: [{ id_material: 1, nombre: 'Lona', cantidad: 5, unidad: 'ml', pieza_id: 10 }],
            reales: [], mermas: [], devoluciones: [],
          },
        }),
      ]);
      const fixture = TestBed.createComponent(OrdenFormComponent);
      await Promise.resolve();
      await Promise.resolve();

      expect(fixture.componentInstance.saldoDelRollo(10, 1)).toBe(8);
      expect(componente.saldoDelRollo(10, 1)).toBe(3);
    });
  });

  it('volver() navega de vuelta a /ordenes', () => {
    const fixture = TestBed.createComponent(OrdenFormComponent);
    fixture.componentInstance.volver();
    expect(routerFalso.navigate).toHaveBeenCalledWith(['/ordenes']);
  });
});
