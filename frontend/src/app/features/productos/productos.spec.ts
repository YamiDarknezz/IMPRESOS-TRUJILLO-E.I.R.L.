import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { InventarioService } from '../../core/services/inventario.service';
import { ProductosService } from '../../core/services/productos.service';
import { ProductosComponent } from './productos';
import { MaterialInventario, Producto } from '../../core/models';

const lona: MaterialInventario = {
  id: 1,
  nombre: 'Lona banner 13 oz',
  unidad_id: 6,
  unidad: 'm2',
  stock_actual: 100,
  alerta_minima: 10,
};

const productoBase: Producto = {
  id: 1,
  nombre: 'Banner 1x1',
  tipo: 'propio',
  precio_base: 50,
  notas: '',
  materiales: [],
};

describe('ProductosComponent', () => {
  let productosFalso: {
    productos: ReturnType<typeof signal<Producto[]>>;
    cargar: ReturnType<typeof vi.fn>;
    crear: ReturnType<typeof vi.fn>;
    actualizar: ReturnType<typeof vi.fn>;
    desactivar: ReturnType<typeof vi.fn>;
  };
  let inventarioFalso: {
    materiales: ReturnType<typeof signal<MaterialInventario[]>>;
    cargar: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    productosFalso = {
      productos: signal([productoBase]),
      cargar: vi.fn().mockResolvedValue(undefined),
      crear: vi.fn().mockResolvedValue(undefined),
      actualizar: vi.fn().mockResolvedValue(undefined),
      desactivar: vi.fn().mockResolvedValue(undefined),
    };
    inventarioFalso = {
      materiales: signal([lona]),
      cargar: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [ProductosComponent],
      providers: [
        { provide: ProductosService, useValue: productosFalso },
        { provide: InventarioService, useValue: inventarioFalso },
      ],
    });
  });

  it('al crearse, carga productos e inventario', () => {
    TestBed.createComponent(ProductosComponent);
    expect(productosFalso.cargar).toHaveBeenCalledTimes(1);
    expect(inventarioFalso.cargar).toHaveBeenCalledTimes(1);
  });

  it('usaReceta() es true solo para productos propios', () => {
    const fixture = TestBed.createComponent(ProductosComponent);
    const componente = fixture.componentInstance;
    expect(componente.usaReceta()).toBe(true);
    componente.actualizar('tipo', 'servicio');
    expect(componente.usaReceta()).toBe(false);
  });

  it('agregarMaterial(): no agrega si no hay material seleccionado', () => {
    const fixture = TestBed.createComponent(ProductosComponent);
    const componente = fixture.componentInstance;
    componente.materialSelId.set('');
    componente.agregarMaterial();
    expect(componente.form().materiales).toEqual([]);
  });

  it('agregarMaterial(): agrega el material elegido a la receta', () => {
    const fixture = TestBed.createComponent(ProductosComponent);
    const componente = fixture.componentInstance;
    componente.materialSelId.set('1');
    componente.materialSelCantidad.set(2);

    componente.agregarMaterial();

    expect(componente.form().materiales).toEqual([
      { id_material: 1, nombre: 'Lona banner 13 oz', cantidad: 2, unidad: 'm2' },
    ]);
    // Limpia los selectores tras agregar.
    expect(componente.materialSelId()).toBe('');
    expect(componente.materialSelCantidad()).toBe(1);
  });

  it('agregarMaterial(): si el material ya estaba en la receta, suma la cantidad', () => {
    const fixture = TestBed.createComponent(ProductosComponent);
    const componente = fixture.componentInstance;
    componente.materialSelId.set('1');
    componente.materialSelCantidad.set(2);
    componente.agregarMaterial();
    componente.materialSelId.set('1');
    componente.materialSelCantidad.set(3);

    componente.agregarMaterial();

    expect(componente.form().materiales).toEqual([
      { id_material: 1, nombre: 'Lona banner 13 oz', cantidad: 5, unidad: 'm2' },
    ]);
  });

  it('quitarMaterial(): elimina la línea por índice', () => {
    const fixture = TestBed.createComponent(ProductosComponent);
    const componente = fixture.componentInstance;
    componente.materialSelId.set('1');
    componente.agregarMaterial();

    componente.quitarMaterial(0);

    expect(componente.form().materiales).toEqual([]);
  });

  it('guardar(): exige nombre antes de llamar al servicio', async () => {
    const fixture = TestBed.createComponent(ProductosComponent);
    await fixture.componentInstance.guardar();
    expect(productosFalso.crear).not.toHaveBeenCalled();
    expect(fixture.componentInstance.errores()['nombre']).toBe('El nombre es requerido.');
  });

  it('eliminar(): pide confirmación antes de desactivar', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(ProductosComponent);

    await fixture.componentInstance.eliminar(productoBase);

    expect(productosFalso.desactivar).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });
});
