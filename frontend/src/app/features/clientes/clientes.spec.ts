import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ClientesService } from '../../core/services/clientes.service';
import { SesionService } from '../../core/services/sesion.service';
import { ClientesComponent } from './clientes';
import { Cliente } from '../../core/models';

const clienteBase: Cliente = {
  id: 1,
  nombre: 'Juan Pérez',
  tipo: 'persona',
  documento: '12345678',
  telefono: '999888777',
  email: '',
  direccion: '',
  notas: '',
  es_corporativo: false,
};

describe('ClientesComponent', () => {
  let clientesFalso: {
    clientes: ReturnType<typeof signal<Cliente[]>>;
    cargar: ReturnType<typeof vi.fn>;
    crear: ReturnType<typeof vi.fn>;
    actualizar: ReturnType<typeof vi.fn>;
    desactivar: ReturnType<typeof vi.fn>;
    obtenerFicha: ReturnType<typeof vi.fn>;
    obtenerResumen: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    clientesFalso = {
      clientes: signal([clienteBase]),
      cargar: vi.fn().mockResolvedValue(undefined),
      crear: vi.fn().mockResolvedValue(1),
      actualizar: vi.fn().mockResolvedValue(undefined),
      desactivar: vi.fn().mockResolvedValue(undefined),
      obtenerFicha: vi.fn(),
      obtenerResumen: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [ClientesComponent],
      providers: [
        { provide: ClientesService, useValue: clientesFalso },
        { provide: SesionService, useValue: { usuario: signal(null), esAdmin: signal(false) } },
      ],
    });
  });

  it('al crearse, pide cargar la lista', () => {
    TestBed.createComponent(ClientesComponent);
    expect(clientesFalso.cargar).toHaveBeenCalledTimes(1);
  });

  it('clientesFiltrados() aplica la búsqueda sobre la lista cargada', () => {
    const fixture = TestBed.createComponent(ClientesComponent);
    const componente = fixture.componentInstance;
    componente.busqueda.set('juan');
    expect(componente.clientesFiltrados()).toEqual([clienteBase]);
    componente.busqueda.set('nadie');
    expect(componente.clientesFiltrados()).toEqual([]);
  });

  it('alternarFormulario(): al cerrar, limpia el formulario y la edición', () => {
    const fixture = TestBed.createComponent(ClientesComponent);
    const componente = fixture.componentInstance;
    componente.abrirEdicion(clienteBase);
    expect(componente.mostrarFormulario()).toBe(true);

    componente.alternarFormulario();

    expect(componente.mostrarFormulario()).toBe(false);
    expect(componente.editando()).toBeNull();
    expect(componente.form().nombre).toBe('');
  });

  it('guardar(): exige nombre antes de llamar al servicio', async () => {
    const fixture = TestBed.createComponent(ClientesComponent);
    const componente = fixture.componentInstance;
    componente.actualizar('nombre', '');

    await componente.guardar();

    expect(clientesFalso.crear).not.toHaveBeenCalled();
    expect(componente.errores()['nombre']).toBe('El nombre es requerido.');
  });

  it('guardar(): sin edición en curso, crea un cliente nuevo', async () => {
    const fixture = TestBed.createComponent(ClientesComponent);
    const componente = fixture.componentInstance;
    componente.alternarFormulario(); // abre el formulario, como haría el botón "Nuevo cliente"
    componente.actualizar('nombre', 'Cliente Nuevo');

    await componente.guardar();

    expect(clientesFalso.crear).toHaveBeenCalledWith(expect.objectContaining({ nombre: 'Cliente Nuevo' }));
    expect(componente.mostrarFormulario()).toBe(false);
  });

  it('guardar(): con edición en curso, actualiza en vez de crear', async () => {
    const fixture = TestBed.createComponent(ClientesComponent);
    const componente = fixture.componentInstance;
    componente.abrirEdicion(clienteBase);

    await componente.guardar();

    expect(clientesFalso.actualizar).toHaveBeenCalledWith(1, expect.objectContaining({ nombre: 'Juan Pérez' }));
    expect(clientesFalso.crear).not.toHaveBeenCalled();
  });

  it('desactivar(): pide confirmación antes de llamar al servicio', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const fixture = TestBed.createComponent(ClientesComponent);

    await fixture.componentInstance.desactivar(clienteBase);

    expect(clientesFalso.desactivar).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('verDetalle(): trae ficha y resumen en paralelo y los deja listos para mostrar', async () => {
    const resumen = { cliente_id: 1, total_ordenes: 2, facturado: 300, por_cobrar: 50 };
    clientesFalso.obtenerFicha.mockResolvedValue(clienteBase);
    clientesFalso.obtenerResumen.mockResolvedValue(resumen);
    const fixture = TestBed.createComponent(ClientesComponent);
    const componente = fixture.componentInstance;

    await componente.verDetalle(clienteBase);

    expect(componente.detalle()).toEqual(clienteBase);
    expect(componente.resumen()).toEqual(resumen);

    componente.cerrarDetalle();
    expect(componente.detalle()).toBeNull();
    expect(componente.resumen()).toBeNull();
  });
});
