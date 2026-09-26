import { ApiService } from './api.service';
import { ListaRemota } from './lista-remota';

interface Item {
  id: number;
  nombre: string;
}

function crearApiFalsa(respuesta: () => Promise<{ status: string; data: Item[] }>) {
  return { get: vi.fn(respuesta) } as unknown as ApiService;
}

describe('ListaRemota', () => {
  it('empieza vacía y sin cargar', () => {
    const api = crearApiFalsa(async () => ({ status: 'success', data: [] }));
    const lista = new ListaRemota<Item>(api, '/api/items');
    expect(lista.items()).toEqual([]);
    expect(lista.cargando()).toBe(false);
  });

  it('carga los items desde la ruta indicada', async () => {
    const datos: Item[] = [{ id: 1, nombre: 'Uno' }];
    const api = crearApiFalsa(async () => ({ status: 'success', data: datos }));
    const lista = new ListaRemota<Item>(api, '/api/items');

    await lista.cargar();

    expect(api.get).toHaveBeenCalledWith('/api/items');
    expect(lista.items()).toEqual(datos);
    expect(lista.cargando()).toBe(false);
  });

  it('no repite la petición si ya cargó y no se fuerza', async () => {
    const api = crearApiFalsa(async () => ({ status: 'success', data: [{ id: 1, nombre: 'Uno' }] }));
    const lista = new ListaRemota<Item>(api, '/api/items');

    await lista.cargar();
    await lista.cargar();

    expect(api.get).toHaveBeenCalledTimes(1);
  });

  it('recargar() vuelve a pedir aunque ya haya datos en caché', async () => {
    const api = crearApiFalsa(async () => ({ status: 'success', data: [] }));
    const lista = new ListaRemota<Item>(api, '/api/items');

    await lista.cargar();
    await lista.recargar();

    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('si dos llamadas piden cargar a la vez, solo hace una petición', async () => {
    let resolver!: (v: { status: string; data: Item[] }) => void;
    const promesaControlada = new Promise<{ status: string; data: Item[] }>(r => (resolver = r));
    const api = { get: vi.fn(() => promesaControlada) } as unknown as ApiService;
    const lista = new ListaRemota<Item>(api, '/api/items');

    const primera = lista.cargar();
    const segunda = lista.cargar();

    resolver({ status: 'success', data: [{ id: 1, nombre: 'Uno' }] });
    await Promise.all([primera, segunda]);

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(lista.items()).toEqual([{ id: 1, nombre: 'Uno' }]);
  });

  it('pone cargando en true mientras espera y en false al terminar', async () => {
    let resolver!: (v: { status: string; data: Item[] }) => void;
    const promesaControlada = new Promise<{ status: string; data: Item[] }>(r => (resolver = r));
    const api = { get: vi.fn(() => promesaControlada) } as unknown as ApiService;
    const lista = new ListaRemota<Item>(api, '/api/items');

    const enCurso = lista.cargar();
    expect(lista.cargando()).toBe(true);

    resolver({ status: 'success', data: [] });
    await enCurso;

    expect(lista.cargando()).toBe(false);
  });

  it('trata data ausente como lista vacía', async () => {
    const api = { get: vi.fn(async () => ({ status: 'success' }) as any) } as unknown as ApiService;
    const lista = new ListaRemota<Item>(api, '/api/items');

    await lista.cargar();

    expect(lista.items()).toEqual([]);
  });

  it('si la petición falla, apaga cargando y no marca como cargado', async () => {
    // `Promise.reject` se crea recién cuando `get()` se invoca (no al definir
    // el mock), para no dejar una promesa rechazada sin manejar de por medio.
    const api = { get: vi.fn(() => Promise.reject(new Error('red caída'))) } as unknown as ApiService;
    const lista = new ListaRemota<Item>(api, '/api/items');

    await expect(lista.cargar()).rejects.toThrow('red caída');
    expect(lista.cargando()).toBe(false);

    await expect(lista.cargar()).rejects.toThrow('red caída');
    expect(api.get).toHaveBeenCalledTimes(2);
  });
});
