import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { SesionService } from './sesion.service';
import { UsuarioSistema } from '../models';

function usuarioCon(rol: UsuarioSistema['rol']): UsuarioSistema {
  return { id: 1, nombre: 'Ana Torres', email: 'ana@impresostrujillo.pe', rol, activo: true };
}

describe('SesionService', () => {
  let apiFalsa: {
    get: ReturnType<typeof vi.fn>;
    alExpirarSesion: ReturnType<typeof vi.fn>;
  };
  let avisoExpiracion: (() => void) | null = null;

  beforeEach(() => {
    localStorage.clear();
    avisoExpiracion = null;
    apiFalsa = {
      get: vi.fn(),
      alExpirarSesion: vi.fn((fn: () => void) => {
        avisoExpiracion = fn;
      }),
    };
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiFalsa }],
    });
  });

  /** Deja el servicio con el perfil indicado, como si viniera del servidor. */
  async function sesionCon(rol: UsuarioSistema['rol']): Promise<SesionService> {
    apiFalsa.get.mockImplementation((ruta: string) => {
      if (ruta === '/api/auth/me') return Promise.resolve({ status: 'success', data: usuarioCon(rol) });
      return Promise.resolve({ status: 'success', data: [] });
    });
    const sesion = TestBed.inject(SesionService);
    await sesion.cargar();
    return sesion;
  }

  // #48: el exploit era escribir el rol a mano en el localStorage. Ahora eso
  // no abre nada, porque el rol sale del servidor y el navegador no guarda
  // ninguna sesión que se pueda editar.
  it('arranca sin perfil aunque el navegador tenga un usuario fabricado', () => {
    localStorage.setItem(
      'it-usuario',
      JSON.stringify({ id: 1, nombre: 'x', email: 'x@y.pe', rol: 'admin', activo: true }),
    );

    const sesion = TestBed.inject(SesionService);

    expect(sesion.usuario()).toBeNull();
    expect(sesion.esAdmin()).toBe(false);
  });

  it('cargar() pide el perfil al servidor y lo deja disponible', async () => {
    const sesion = await sesionCon('operario');

    expect(apiFalsa.get).toHaveBeenCalledWith('/api/auth/me');
    expect(sesion.usuario()?.rol).toBe('operario');
  });

  it('cargar() no repite la petición de perfil si ya cargó', async () => {
    const sesion = await sesionCon('operario');

    await sesion.cargar();

    expect(apiFalsa.get).toHaveBeenCalledTimes(1);
  });

  it('dos cargar() simultáneos comparten una sola petición (guards en paralelo)', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: usuarioCon('operario') });
    const sesion = TestBed.inject(SesionService);

    await Promise.all([sesion.cargar(), sesion.cargar(), sesion.cargar()]);

    expect(apiFalsa.get).toHaveBeenCalledTimes(1);
  });

  it('si el perfil admite supervisión, también carga la lista de usuarios', async () => {
    apiFalsa.get.mockImplementation((ruta: string) => {
      if (ruta === '/api/auth/me') return Promise.resolve({ status: 'success', data: usuarioCon('admin') });
      if (ruta === '/api/usuarios') {
        return Promise.resolve({ status: 'success', data: [usuarioCon('admin'), usuarioCon('operario')] });
      }
      throw new Error(`ruta inesperada: ${ruta}`);
    });
    const sesion = TestBed.inject(SesionService);

    await sesion.cargar();

    expect(apiFalsa.get).toHaveBeenCalledWith('/api/usuarios');
    expect(sesion.usuarios().length).toBe(2);
  });

  it('si el perfil NO admite supervisión, no pide la lista de usuarios', async () => {
    const sesion = await sesionCon('operario');

    expect(apiFalsa.get).not.toHaveBeenCalledWith('/api/usuarios');
    expect(sesion.usuarios()).toEqual([]);
  });

  it('si falla la carga del perfil, queda sin sesión y no lanza', async () => {
    apiFalsa.get.mockRejectedValue(new Error('sesión inválida'));
    const sesion = TestBed.inject(SesionService);

    await expect(sesion.cargar()).resolves.toBeUndefined();

    expect(sesion.usuario()).toBeNull();
  });

  it('reiniciar() deja la sesión vacía y la próxima carga vuelve a preguntar', async () => {
    const sesion = await sesionCon('admin');
    expect(sesion.usuarios().length).toBe(0);

    sesion.reiniciar();

    expect(sesion.usuario()).toBeNull();
    expect(sesion.usuarios()).toEqual([]);

    apiFalsa.get.mockResolvedValue({ status: 'success', data: usuarioCon('secretaria') });
    await sesion.cargar();
    expect(sesion.usuario()?.rol).toBe('secretaria');
  });

  it('si el servidor invalida la sesión, el perfil en memoria se limpia', async () => {
    const sesion = await sesionCon('admin');
    expect(sesion.usuario()).not.toBeNull();

    avisoExpiracion?.();

    expect(sesion.usuario()).toBeNull();
    expect(sesion.esAdmin()).toBe(false);
  });

  it('esAdmin / esSupervisor / puedeGestionarOrdenes reflejan el rol del servidor', async () => {
    const sesion = await sesionCon('secretaria');

    expect(sesion.esAdmin()).toBe(false);
    expect(sesion.esSupervisor()).toBe(false);
    expect(sesion.puedeGestionarOrdenes()).toBe(true);
    expect(sesion.puedeVender()).toBe(true);
  });

  it('nombreDe() busca el nombre en la lista cargada de usuarios', async () => {
    apiFalsa.get.mockImplementation((ruta: string) => {
      if (ruta === '/api/auth/me') return Promise.resolve({ status: 'success', data: usuarioCon('admin') });
      return Promise.resolve({
        status: 'success',
        data: [{ ...usuarioCon('operario'), id: 7, nombre: 'Luis' }],
      });
    });
    const sesion = TestBed.inject(SesionService);
    await sesion.cargar();

    expect(sesion.nombreDe(7)).toBe('Luis');
    expect(sesion.nombreDe(999)).toBe('');
    expect(sesion.nombreDe(null)).toBe('');
  });

  it('puedeGestionar(): el supervisor siempre puede, el resto solo si la orden es suya', async () => {
    const sesion = await sesionCon('operario');

    expect(sesion.puedeGestionar({ asignado_a: 1 })).toBe(true);
    expect(sesion.puedeGestionar({ asignado_a: 2 })).toBe(false);
  });

  it('puedeAvanzarEtapa(): el supervisor siempre puede, el resto solo si la orden es suya', async () => {
    const sesion = await sesionCon('subgerente');

    expect(sesion.puedeAvanzarEtapa({ asignado_a: 999 })).toBe(true);
  });
});
