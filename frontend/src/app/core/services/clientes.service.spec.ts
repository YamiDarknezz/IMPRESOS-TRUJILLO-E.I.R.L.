import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ClientesService, filtrarClientes } from './clientes.service';
import { Cliente } from '../models';

const clienteBase: Cliente = {
  id: 1,
  nombre: 'Juan Pérez',
  tipo: 'persona',
  documento: '12345678',
  telefono: '999888777',
  email: 'juan@correo.com',
  direccion: 'Av. Siempre Viva 123',
  notas: '',
  es_corporativo: false,
};

describe('ClientesService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let servicio: ClientesService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(ClientesService);
  });

  it('cargar() pide /api/clientes', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [clienteBase] });
    await servicio.cargar();
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/clientes');
    expect(servicio.clientes()).toEqual([clienteBase]);
  });

  it('nombreDe() busca en la lista cargada, o devuelve vacío', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [clienteBase] });
    await servicio.cargar();
    expect(servicio.nombreDe(1)).toBe('Juan Pérez');
    expect(servicio.nombreDe(99)).toBe('');
    expect(servicio.nombreDe(null)).toBe('');
  });

  it('crear() envía los datos y devuelve el id creado', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: { ...clienteBase, id: 5 } });
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });

    const id = await servicio.crear({ nombre: 'Nuevo Cliente' });

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/clientes', { nombre: 'Nuevo Cliente' });
    expect(id).toBe(5);
  });

  it('actualizar() usa PATCH y recarga', async () => {
    apiFalsa.patch.mockResolvedValue({ status: 'success', data: {} });
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });

    await servicio.actualizar(1, { ...clienteBase, nombre: 'Juan P.' });

    expect(apiFalsa.patch).toHaveBeenCalledWith('/api/clientes/1', { ...clienteBase, nombre: 'Juan P.' });
  });

  it('desactivar() usa DELETE', async () => {
    apiFalsa.delete.mockResolvedValue({ status: 'success', data: {} });
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });

    await servicio.desactivar(1);

    expect(apiFalsa.delete).toHaveBeenCalledWith('/api/clientes/1');
  });

  it('obtenerFicha() pide la ficha puntual del cliente', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: clienteBase });
    const ficha = await servicio.obtenerFicha(1);
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/clientes/1');
    expect(ficha).toEqual(clienteBase);
  });

  it('obtenerResumen() pide el resumen financiero del cliente', async () => {
    const resumen = { cliente_id: 1, total_ordenes: 3, facturado: 500, por_cobrar: 100 };
    apiFalsa.get.mockResolvedValue({ status: 'success', data: resumen });
    const res = await servicio.obtenerResumen(1);
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/clientes/1/resumen');
    expect(res).toEqual(resumen);
  });
});

describe('filtrarClientes', () => {
  const otro: Cliente = { ...clienteBase, id: 2, nombre: 'María López', documento: '87654321', telefono: '911222333' };
  const lista = [clienteBase, otro];

  it('sin texto, devuelve la lista completa', () => {
    expect(filtrarClientes(lista, '')).toEqual(lista);
    expect(filtrarClientes(lista, '   ')).toEqual(lista);
  });

  it('filtra por nombre, sin importar mayúsculas', () => {
    expect(filtrarClientes(lista, 'maría')).toEqual([otro]);
  });

  it('filtra por documento', () => {
    expect(filtrarClientes(lista, '1234')).toEqual([clienteBase]);
  });

  it('filtra por teléfono', () => {
    expect(filtrarClientes(lista, '911')).toEqual([otro]);
  });

  it('sin coincidencias, devuelve lista vacía', () => {
    expect(filtrarClientes(lista, 'no existe')).toEqual([]);
  });
});
