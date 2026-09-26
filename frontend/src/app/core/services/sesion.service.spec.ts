import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { SesionService } from './sesion.service';
import { guardarUsuario, leerUsuarioGuardado } from './sesion-almacen';
import { UsuarioSistema } from '../models';

function usuarioCon(rol: UsuarioSistema['rol']): UsuarioSistema {
  return { id: 1, nombre: 'Ana Torres', email: 'ana@impresostrujillo.pe', rol, activo: true };
}

describe('SesionService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    apiFalsa = { get: vi.fn() };
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: apiFalsa }],
    });
  });

  it('arranca con el usuario que hubiera guardado en el navegador', () => {
    guardarUsuario(usuarioCon('operario'));
    const sesion = TestBed.inject(SesionService);
    expect(sesion.usuario()?.rol).toBe('operario');
  });

  it('cargar() pide el perfil y lo guarda', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: usuarioCon('operario') });
    const sesion = TestBed.inject(SesionService);

    await sesion.cargar();

    expect(apiFalsa.get).toHaveBeenCalledWith('/api/auth/me');
    expect(sesion.usuario()?.rol).toBe('operario');
    expect(leerUsuarioGuardado()?.rol).toBe('operario');
  });

  it('cargar() no repite la petición de perfil si ya cargó', async () => {
    apiFalsa.get.mockResolvedValue({ status: 'success', data: usuarioCon('operario') });
    const sesion = TestBed.inject(SesionService);

    await sesion.cargar();
    await sesion.cargar();

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
    apiFalsa.get.mockResolvedValue({ status: 'success', data: usuarioCon('operario') });
    const sesion = TestBed.inject(SesionService);

    await sesion.cargar();

    expect(apiFalsa.get).not.toHaveBeenCalledWith('/api/usuarios');
  });

  it('si falla la carga del perfil, deja la interfaz sin perfil pero no lanza', async () => {
    apiFalsa.get.mockRejectedValue(new Error('sesión inválida'));
    const sesion = TestBed.inject(SesionService);

    await expect(sesion.cargar()).resolves.toBeUndefined();
  });

  it('reiniciar() vuelve a leer del almacenamiento y limpia la lista de usuarios', async () => {
    apiFalsa.get.mockImplementation((ruta: string) => {
      if (ruta === '/api/auth/me') return Promise.resolve({ status: 'success', data: usuarioCon('admin') });
      return Promise.resolve({ status: 'success', data: [usuarioCon('admin')] });
    });
    const sesion = TestBed.inject(SesionService);
    await sesion.cargar();
    expect(sesion.usuarios().length).toBe(1);

    guardarUsuario(usuarioCon('operario'));
    sesion.reiniciar();

    expect(sesion.usuario()?.rol).toBe('operario');
    expect(sesion.usuarios()).toEqual([]);

    // Tras reiniciar, cargar() vuelve a pedir el perfil.
    await sesion.cargar();
    expect(apiFalsa.get).toHaveBeenCalledWith('/api/auth/me');
  });

  it('esAdmin / esSupervisor / puedeGestionarOrdenes reflejan el rol actual', () => {
    guardarUsuario(usuarioCon('secretaria'));
    const sesion = TestBed.inject(SesionService);

    expect(sesion.esAdmin()).toBe(false);
    expect(sesion.esSupervisor()).toBe(false);
    expect(sesion.puedeGestionarOrdenes()).toBe(true);
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

  it('puedeGestionar(): el supervisor siempre puede, el resto solo si la orden es suya', () => {
    guardarUsuario(usuarioCon('operario'));
    const sesion = TestBed.inject(SesionService);
    // usuario id 1 (definido en usuarioCon)
    expect(sesion.puedeGestionar({ asignado_a: 1 })).toBe(true);
    expect(sesion.puedeGestionar({ asignado_a: 2 })).toBe(false);
  });

  it('puedeAvanzarEtapa(): el supervisor siempre puede, el resto solo si la orden es suya', () => {
    guardarUsuario(usuarioCon('subgerente'));
    const sesion = TestBed.inject(SesionService);
    expect(sesion.puedeAvanzarEtapa({ asignado_a: 999 })).toBe(true);
  });
});
