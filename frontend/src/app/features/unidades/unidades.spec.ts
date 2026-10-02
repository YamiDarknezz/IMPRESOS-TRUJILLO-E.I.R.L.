import { TestBed } from '@angular/core/testing';
import { UnidadesService } from '../../core/services/unidades.service';
import { UnidadesComponent } from './unidades';
import { Unidad } from '../../core/models';
import { signal } from '@angular/core';

const kilogramo: Unidad = { id: 1, nombre: 'Kilogramo', abreviatura: 'kg', activo: true };
const pulgada: Unidad = { id: 2, nombre: 'Pulgada', abreviatura: 'in', activo: false };

describe('UnidadesComponent', () => {
  let servicioFalso: {
    unidades: ReturnType<typeof signal<Unidad[]>>;
    todas: ReturnType<typeof signal<Unidad[]>>;
    cargar: ReturnType<typeof vi.fn>;
    cargarTodas: ReturnType<typeof vi.fn>;
    crear: ReturnType<typeof vi.fn>;
    actualizar: ReturnType<typeof vi.fn>;
    eliminar: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    servicioFalso = {
      unidades: signal([kilogramo]),
      todas: signal([kilogramo, pulgada]),
      cargar: vi.fn().mockResolvedValue(undefined),
      cargarTodas: vi.fn().mockResolvedValue(undefined),
      crear: vi.fn().mockResolvedValue(undefined),
      actualizar: vi.fn().mockResolvedValue(undefined),
      eliminar: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [UnidadesComponent],
      providers: [{ provide: UnidadesService, useValue: servicioFalso }],
    });
  });

  it('al crearse, pide el catálogo completo (incluye las desactivadas)', () => {
    TestBed.createComponent(UnidadesComponent);
    expect(servicioFalso.cargarTodas).toHaveBeenCalledTimes(1);
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

  describe('edición (#58)', () => {
    it('muestra las unidades desactivadas atenuadas y con su etiqueta', () => {
      const fixture = TestBed.createComponent(UnidadesComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
      expect(fixture.nativeElement.querySelectorAll('tr.row-inactiva').length).toBe(1);
      expect(fixture.nativeElement.textContent).toContain('inactiva');
    });

    it('editar(): abre la fila con los valores actuales', () => {
      const componente = TestBed.createComponent(UnidadesComponent).componentInstance;

      componente.editar(kilogramo);

      expect(componente.editando()).toEqual(kilogramo);
      expect(componente.nombreEdicion()).toBe('Kilogramo');
      expect(componente.abreviaturaEdicion()).toBe('kg');
    });

    it('guardarEdicion(): guarda nombre y abreviatura y cierra la edición', async () => {
      const componente = TestBed.createComponent(UnidadesComponent).componentInstance;
      componente.editar(kilogramo);
      componente.nombreEdicion.set('  Kilogramos  ');
      componente.abreviaturaEdicion.set(' kg ');

      await componente.guardarEdicion();

      expect(servicioFalso.actualizar).toHaveBeenCalledWith(1, 'Kilogramos', 'kg');
      expect(componente.editando()).toBeNull();
    });

    it('guardarEdicion(): sin nombre no llama al servicio', async () => {
      const componente = TestBed.createComponent(UnidadesComponent).componentInstance;
      componente.editar(kilogramo);
      componente.nombreEdicion.set('   ');

      await componente.guardarEdicion();

      expect(servicioFalso.actualizar).not.toHaveBeenCalled();
      expect(componente.errorEdicion()).toBe('El nombre es requerido.');
    });

    it('cancelarEdicion(): cierra sin tocar el servicio', () => {
      const componente = TestBed.createComponent(UnidadesComponent).componentInstance;
      componente.editar(kilogramo);

      componente.cancelarEdicion();

      expect(componente.editando()).toBeNull();
      expect(servicioFalso.actualizar).not.toHaveBeenCalled();
    });
  });

  it('eliminar(): si el usuario cancela la confirmación, no llama al servicio', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const fixture = TestBed.createComponent(UnidadesComponent);

    await fixture.componentInstance.eliminar(kilogramo);

    expect(servicioFalso.eliminar).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('eliminar(): si el usuario confirma, desactiva la unidad', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(UnidadesComponent);

    await fixture.componentInstance.eliminar(kilogramo);

    expect(servicioFalso.eliminar).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });
});
