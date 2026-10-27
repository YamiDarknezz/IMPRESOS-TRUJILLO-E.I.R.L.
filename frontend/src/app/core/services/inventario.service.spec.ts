import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import {
  InventarioService,
  filtrarMateriales,
  filtrarPiezas,
  tieneStockBajo,
  ubicacionesEnUso,
} from './inventario.service';
import { MaterialInventario, PiezaLoteMaterial } from '../models';

const material: MaterialInventario = {
  id: 1,
  nombre: 'Lona banner 13 oz',
  unidad_id: 6,
  unidad: 'm2',
  stock_actual: 98.5,
  alerta_minima: 30,
};

describe('InventarioService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let servicio: InventarioService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(InventarioService);
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [material] });
  });

  it('cargar() pide /api/inventario', async () => {
    await servicio.cargar();
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/inventario');
    expect(servicio.materiales()).toEqual([material]);
  });

  it('crear() envía los datos con el stock inicial', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
    const datos = { nombre: 'Vinil', unidad_id: 1, alerta_minima: 5, dias_reabastecimiento: 3, stock_inicial: 10 };

    await servicio.crear(datos);

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/inventario', datos);
  });

  it('actualizar(): si el stock no cambió, solo edita la ficha', async () => {
    apiFalsa.patch.mockResolvedValue({ status: 'success', data: {} });
    const datos = { nombre: 'Lona banner 13 oz', unidad_id: 6, alerta_minima: 30, dias_reabastecimiento: 5 };

    await servicio.actualizar(1, datos, 98.5, 98.5);

    expect(apiFalsa.patch).toHaveBeenCalledTimes(1);
    expect(apiFalsa.patch).toHaveBeenCalledWith('/api/inventario/1', datos);
  });

  it('actualizar(): si el stock cambió, también ajusta el stock por separado', async () => {
    apiFalsa.patch.mockResolvedValue({ status: 'success', data: {} });
    const datos = { nombre: 'Lona banner 13 oz', unidad_id: 6, alerta_minima: 30, dias_reabastecimiento: 5 };

    await servicio.actualizar(1, datos, 90, 98.5);

    expect(apiFalsa.patch).toHaveBeenCalledTimes(2);
    expect(apiFalsa.patch).toHaveBeenCalledWith('/api/inventario/1/stock', {
      stock_actual: 90,
      nota: 'Corrección manual desde el panel',
    });
  });

  it('listarMovimientos() pide la trazabilidad del material', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });
    await servicio.listarMovimientos(1);
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/inventario/1/movimientos');
  });

  describe('piezas (rollos y planchas)', () => {
    it('listarPiezas() sin filtros no agrega query string', async () => {
      apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });
      await servicio.listarPiezas();
      expect(apiFalsa.get).toHaveBeenCalledWith('/api/inventario/piezas');
    });

    it('listarPiezas() arma la query con material_id y estado', async () => {
      apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });
      await servicio.listarPiezas(1, 'disponible');
      expect(apiFalsa.get).toHaveBeenCalledWith('/api/inventario/piezas?material_id=1&estado=disponible');
    });

    it('registrarPieza() postea al endpoint de piezas', async () => {
      const pieza = { id: 1 } as PiezaLoteMaterial;
      apiFalsa.post.mockResolvedValue({ status: 'success', data: pieza });
      const datos = { material_id: 1, codigo_identificador: 'ROLLO-01', capacidad_inicial: 100 };

      const creada = await servicio.registrarPieza(datos);

      expect(apiFalsa.post).toHaveBeenCalledWith('/api/inventario/piezas', datos);
      expect(creada).toEqual(pieza);
    });

    it('registrarConsumoPieza() postea al endpoint de consumos de la pieza', async () => {
      apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });
      const datos = { trabajo_descripcion: 'Corte de banner', cantidad_consumida: 3 };

      await servicio.registrarConsumoPieza(1, datos);

      expect(apiFalsa.post).toHaveBeenCalledWith('/api/inventario/piezas/1/consumos', datos);
    });
  });
});

describe('tieneStockBajo', () => {
  it('usa el valor calculado por el servidor si viene', () => {
    expect(tieneStockBajo({ ...material, stock_bajo: true, stock_actual: 999 })).toBe(true);
    expect(tieneStockBajo({ ...material, stock_bajo: false, stock_actual: 0 })).toBe(false);
  });

  it('si el servidor no lo calculó, compara stock contra alerta mínima', () => {
    expect(tieneStockBajo({ ...material, stock_actual: 10, alerta_minima: 30 })).toBe(true);
    expect(tieneStockBajo({ ...material, stock_actual: 50, alerta_minima: 30 })).toBe(false);
  });
});

describe('filtrarMateriales', () => {
  const otro: MaterialInventario = { ...material, id: 2, nombre: 'Acrílico 3 mm' };
  const lista = [material, otro];

  it('sin texto, devuelve todo', () => {
    expect(filtrarMateriales(lista, '')).toEqual(lista);
  });

  it('filtra por nombre sin importar mayúsculas', () => {
    expect(filtrarMateriales(lista, 'acrílico')).toEqual([otro]);
  });

  // Issue #109: "¿qué hay en el almacén?"
  describe('por ubicación (#109)', () => {
    const enAlmacen = { ...material, id: 3, nombre: 'Vinilo', ubicacion_estante: 'Almacén' };
    const enEstante = { ...otro, ubicacion_estante: 'Estante 2' };
    const todos = [material, enAlmacen, enEstante];

    it('el texto también busca en la ubicación', () => {
      expect(filtrarMateriales(todos, 'almacén')).toEqual([enAlmacen]);
      expect(filtrarMateriales(todos, 'estante')).toEqual([enEstante]);
    });

    it('una ubicación exacta deja solo lo que está ahí', () => {
      expect(filtrarMateriales(todos, '', 'Almacén')).toEqual([enAlmacen]);
    });

    it('la ubicación exacta se combina con el texto', () => {
      expect(filtrarMateriales(todos, 'vinilo', 'Estante 2')).toEqual([]);
      expect(filtrarMateriales(todos, 'vinilo', 'Almacén')).toEqual([enAlmacen]);
    });

    it('un material sin ubicación no aparece al filtrar por una', () => {
      expect(filtrarMateriales([material], '', 'Almacén')).toEqual([]);
    });

    it('ubicacionesEnUso() lista las distintas, sin vacías y ordenadas', () => {
      const repetida = { ...enAlmacen, id: 4 };
      expect(ubicacionesEnUso([material, enEstante, enAlmacen, repetida])).toEqual(['Almacén', 'Estante 2']);
    });
  });
});

describe('filtrarPiezas (#109)', () => {
  const rollo = (sobrescribe: Partial<PiezaLoteMaterial>): PiezaLoteMaterial => ({
    id: 1, material_id: 1, material_nombre: 'Lona banner', codigo_identificador: 'ROLL-01',
    capacidad_inicial: 50, saldo_restante: 50, unidad_medida: 'm', costo_adquisicion: 0, estado: 'disponible',
    ubicacion: 'Estante 2', maquina_asignada: '', fecha_ingreso: '2026-09-01', nota: '',
    total_recaudado: 0, ...sobrescribe,
  });
  const a = rollo({});
  const b = rollo({ id: 2, codigo_identificador: 'PL-02', material_nombre: 'Acrílico', ubicacion: 'Almacén' });

  it('sin texto devuelve todo', () => {
    expect(filtrarPiezas([a, b], '  ')).toEqual([a, b]);
  });

  it('busca por código, material o ubicación', () => {
    expect(filtrarPiezas([a, b], 'pl-02')).toEqual([b]);
    expect(filtrarPiezas([a, b], 'lona')).toEqual([a]);
    expect(filtrarPiezas([a, b], 'almacén')).toEqual([b]);
  });
});
