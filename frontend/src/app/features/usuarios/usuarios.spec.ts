import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { UsuariosService } from '../../core/services/usuarios.service';
import { SesionService } from '../../core/services/sesion.service';
import { UsuariosComponent } from './usuarios';
import { UsuarioSistema } from '../../core/models';

const operario: UsuarioSistema = {
  id: 2,
  nombre: 'Luis Ramos',
  email: 'luis@impresostrujillo.pe',
  rol: 'operario',
  activo: true,
};

describe('UsuariosComponent', () => {
  let usuariosFalso: {
    listar: ReturnType<typeof vi.fn>;
    crear: ReturnType<typeof vi.fn>;
    actualizar: ReturnType<typeof vi.fn>;
  };
  let sesionFalsa: { cargar: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    usuariosFalso = {
      listar: vi.fn().mockResolvedValue([operario]),
      crear: vi.fn().mockResolvedValue(operario),
      actualizar: vi.fn().mockResolvedValue(operario),
    };
    sesionFalsa = { cargar: vi.fn().mockResolvedValue(undefined) };
    TestBed.configureTestingModule({
      imports: [UsuariosComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosFalso },
        { provide: SesionService, useValue: sesionFalsa },
      ],
    });
  });

  it('al crearse, carga la lista de cuentas', () => {
    TestBed.createComponent(UsuariosComponent);
    expect(usuariosFalso.listar).toHaveBeenCalledTimes(1);
  });

  it('si listar() falla, avisa con alert y no revienta', async () => {
    usuariosFalso.listar.mockRejectedValueOnce({ error: { detail: 'Sin permiso' } });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fixture = TestBed.createComponent(UsuariosComponent);
    await fixture.componentInstance.cargar();
    expect(alertSpy).toHaveBeenCalledWith('Sin permiso');
    alertSpy.mockRestore();
  });

  describe('validación del formulario', () => {
    it('exige nombre, correo válido y contraseña de al menos 8 caracteres', async () => {
      const fixture = TestBed.createComponent(UsuariosComponent);
      const componente = fixture.componentInstance;
      componente.actualizar('nombre', '');
      componente.actualizar('email', 'no-es-correo');
      componente.actualizar('password', '123');

      await componente.guardar();

      expect(componente.errores()).toEqual({
        nombre: 'El nombre es requerido.',
        email: 'Ingresa un correo válido.',
        password: 'La contraseña debe tener al menos 8 caracteres.',
      });
      expect(usuariosFalso.crear).not.toHaveBeenCalled();
    });

    it('con datos válidos, crea la cuenta y recarga sesión y lista', async () => {
      const fixture = TestBed.createComponent(UsuariosComponent);
      const componente = fixture.componentInstance;
      componente.alternarFormulario(); // abre el formulario, como haría el botón "Nuevo usuario"
      componente.actualizar('nombre', 'Luis Ramos');
      componente.actualizar('email', ' LUIS@impresostrujillo.pe ');
      componente.actualizar('password', 'Clave1234');
      componente.actualizar('rol', 'operario');

      await componente.guardar();

      expect(usuariosFalso.crear).toHaveBeenCalledWith({
        nombre: 'Luis Ramos',
        email: 'luis@impresostrujillo.pe',
        password: 'Clave1234',
        rol: 'operario',
      });
      expect(sesionFalsa.cargar).toHaveBeenCalled();
      expect(componente.mostrarFormulario()).toBe(false);
    });
  });

  it('alternarActivo(): pide confirmación y activa/desactiva la cuenta', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(UsuariosComponent);

    await fixture.componentInstance.alternarActivo(operario);

    expect(usuariosFalso.actualizar).toHaveBeenCalledWith(2, { activo: false });
    confirmSpy.mockRestore();
  });

  it('alternarActivo(): si el usuario cancela, no llama al servicio', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const fixture = TestBed.createComponent(UsuariosComponent);

    await fixture.componentInstance.alternarActivo(operario);

    expect(usuariosFalso.actualizar).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('cambiarRol(): si el rol no cambió, no llama al servicio', async () => {
    const fixture = TestBed.createComponent(UsuariosComponent);
    await fixture.componentInstance.cambiarRol(operario, 'operario');
    expect(usuariosFalso.actualizar).not.toHaveBeenCalled();
  });

  it('cambiarRol(): con un rol distinto, actualiza y recarga', async () => {
    const fixture = TestBed.createComponent(UsuariosComponent);
    await fixture.componentInstance.cambiarRol(operario, 'admin');
    expect(usuariosFalso.actualizar).toHaveBeenCalledWith(2, { rol: 'admin' });
  });
});
