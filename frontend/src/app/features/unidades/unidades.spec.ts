import { TestBed } from '@angular/core/testing';
import { UnidadesService } from '../../core/services/unidades.service';
import { UnidadesComponent } from './unidades';
import { Unidad } from '../../core/models';
import { signal } from '@angular/core';

const kilogramo: Unidad = { id: 1, nombre: 'Kilogramo', abreviatura: 'kg', activo: true };

describe('UnidadesComponent', () => {
  let servicioFalso: {
    unidades: ReturnType<typeof signal<Unidad[]>>;
    cargar: ReturnType<typeof vi.fn>;
    crear: ReturnType<typeof vi.fn>;
    eliminar: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    servicioFalso = {
      unidades: signal([kilogramo]),
      cargar: vi.fn().mockResolvedValue(undefined),
      crear: vi.fn().mockResolvedValue(undefined),
      eliminar: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [UnidadesComponent],
      providers: [{ provide: UnidadesService, useValue: servicioFalso }],
    });
  });

  it('al crearse, pide cargar el catálogo', () => {
    TestBed.createComponent(UnidadesComponent);
    expect(servicioFalso.cargar).toHaveBeenCalledTimes(1);
  });

  it('guardar(): no llama al servicio si el nombre está vacío', async () => {
    const fixture = TestBed.createComponent(UnidadesComponent);
    const componente = fixture.componentInstance;

    await componente.guardar();

    expect(servicioFalso.crear).not.toHaveBeenCalled();
    expect(componente.error()).toBe('El nombre es requerido.');
  });

  it('guardar(): crea la unidad y limpia el formulario', async () => {
    const fixture = TestBed.createComponent(UnidadesComponent);
    const componente = fixture.componentInstance;
    componente.nombre.set('  Kilogramo  ');
    componente.abreviatura.set(' kg ');

    await componente.guardar();

    expect(servicioFalso.crear).toHaveBeenCalledWith('Kilogramo', 'kg');
    expect(componente.nombre()).toBe('');
    expect(componente.abreviatura()).toBe('');
    expect(componente.error()).toBe('');
  });

  it('guardar(): si el servicio falla, avisa con alert y no revienta', async () => {
    servicioFalso.crear.mockRejectedValue({ error: { detail: 'Ya existe una unidad con ese nombre.' } });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fixture = TestBed.createComponent(UnidadesComponent);
    const componente = fixture.componentInstance;
    componente.nombre.set('Kilogramo');

    await componente.guardar();

    expect(alertSpy).toHaveBeenCalledWith('Ya existe una unidad con ese nombre.');
    expect(componente.guardando()).toBe(false);
    alertSpy.mockRestore();
  });

  it('eliminar(): si el usuario cancela la confirmación, no llama al servicio', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const fixture = TestBed.createComponent(UnidadesComponent);

    await fixture.componentInstance.eliminar(kilogramo);

    expect(servicioFalso.eliminar).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('eliminar(): si el usuario confirma, elimina la unidad', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(UnidadesComponent);

    await fixture.componentInstance.eliminar(kilogramo);

    expect(servicioFalso.eliminar).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });
});
