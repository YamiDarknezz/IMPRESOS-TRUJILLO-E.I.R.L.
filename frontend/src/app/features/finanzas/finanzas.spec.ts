import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { FinanzasService } from '../../core/services/finanzas.service';
import { SesionService } from '../../core/services/sesion.service';
import { FinanzasComponent } from './finanzas';
import { ResumenFinanzas } from '../../core/models';

const resumenCompleto: ResumenFinanzas = {
  es_supervisor: true,
  total_contratos: 100,
  total_por_cobrar: 20,
  total_ordenes: 5,
  total_ingresos: 80,
  total_adelantos: 30,
  por_metodo: { efectivo: 50, yape: 30 },
  por_unidad_negocio: {
    imprenta: { contratos: 60, ingresos: 50, por_cobrar: 10 },
    gigantografias: { contratos: 40, ingresos: 30, por_cobrar: 10 },
  },
  por_trabajador: [{ uid: 1, nombre: 'Ana', contratos: 100, ingresos: 80, por_cobrar: 20, ordenes: 5 }],
};

describe('FinanzasComponent', () => {
  let servicioFalso: {
    resumen: ReturnType<typeof signal<ResumenFinanzas | null>>;
    cargando: ReturnType<typeof signal<boolean>>;
    porMetodo: ReturnType<typeof signal<{ metodo: string; monto: number }[]>>;
    desde: ReturnType<typeof signal<string>>;
    hasta: ReturnType<typeof signal<string>>;
    trabajador: ReturnType<typeof signal<number | null>>;
    cargar: ReturnType<typeof vi.fn>;
    setMesActual: ReturnType<typeof vi.fn>;
    setHoy: ReturnType<typeof vi.fn>;
    setTodo: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    servicioFalso = {
      resumen: signal(resumenCompleto),
      cargando: signal(false),
      porMetodo: signal([{ metodo: 'Efectivo', monto: 50 }, { metodo: 'Yape', monto: 30 }]),
      desde: signal('2026-09-01'),
      hasta: signal('2026-09-18'),
      trabajador: signal<number | null>(null),
      cargar: vi.fn().mockResolvedValue(undefined),
      setMesActual: vi.fn(),
      setHoy: vi.fn(),
      setTodo: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [FinanzasComponent],
      providers: [
        { provide: FinanzasService, useValue: servicioFalso },
        { provide: SesionService, useValue: { nombreDe: vi.fn().mockReturnValue('Ana Torres') } },
      ],
    });
  });

  it('al crearse, carga el resumen', () => {
    TestBed.createComponent(FinanzasComponent);
    expect(servicioFalso.cargar).toHaveBeenCalledTimes(1);
  });

  it('si cargar() falla, avisa con alert y no revienta', async () => {
    servicioFalso.cargar.mockRejectedValueOnce({ error: { detail: 'Sin permiso' } });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fixture = TestBed.createComponent(FinanzasComponent);
    await fixture.componentInstance.cargar();
    expect(alertSpy).toHaveBeenCalledWith('Sin permiso');
    alertSpy.mockRestore();
  });

  it('cambiarTrabajador() actualiza el filtro y recarga', () => {
    const fixture = TestBed.createComponent(FinanzasComponent);
    fixture.componentInstance.cambiarTrabajador(5);
    expect(servicioFalso.trabajador()).toBe(5);
    expect(servicioFalso.cargar).toHaveBeenCalledTimes(2); // una al crear, otra al cambiar
  });

  it('filtrarMesActual/Hoy/Todo delegan en el servicio', () => {
    const fixture = TestBed.createComponent(FinanzasComponent);
    fixture.componentInstance.filtrarMesActual();
    fixture.componentInstance.filtrarHoy();
    fixture.componentInstance.filtrarTodo();
    expect(servicioFalso.setMesActual).toHaveBeenCalledTimes(1);
    expect(servicioFalso.setHoy).toHaveBeenCalledTimes(1);
    expect(servicioFalso.setTodo).toHaveBeenCalledTimes(1);
  });

  describe('exportarCSV()', () => {
    // `descargarCSV` no se puede mockear con `vi.mock` bajo el test-runner de
    // Angular (rechaza mocks de imports relativos), así que se deja correr de
    // verdad y se intercepta el Blob que arma antes de "descargarlo".
    let blobCapturado: Blob | undefined;
    let nombreCapturado: string | undefined;

    beforeEach(() => {
      blobCapturado = undefined;
      nombreCapturado = undefined;
      vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      URL.createObjectURL = vi.fn((blob: Blob) => {
        blobCapturado = blob;
        return 'blob:falso';
      }) as unknown as typeof URL.createObjectURL;
      URL.revokeObjectURL = vi.fn();
      vi.spyOn(HTMLAnchorElement.prototype, 'download', 'set').mockImplementation(function (
        this: HTMLAnchorElement,
        valor: string,
      ) {
        nombreCapturado = valor;
      });
    });

    afterEach(() => vi.restoreAllMocks());

    it('si no hay resumen cargado, no exporta nada', () => {
      servicioFalso.resumen.set(null);
      const fixture = TestBed.createComponent(FinanzasComponent);

      fixture.componentInstance.exportarCSV();

      expect(URL.createObjectURL).not.toHaveBeenCalled();
    });

    it('arma el CSV con el resumen, el desglose por unidad y por trabajador', async () => {
      const fixture = TestBed.createComponent(FinanzasComponent);

      fixture.componentInstance.exportarCSV();

      expect(nombreCapturado).toBe('finanzas_2026-09-01_a_2026-09-18.csv');
      const texto = await blobCapturado!.text();
      expect(texto).toContain('Ingresos recibidos');
      expect(texto).toContain('Generado por trabajador');
      expect(texto).toContain('Ana');
    });

    it('sin permiso de supervisor, no incluye el desglose por trabajador', async () => {
      servicioFalso.resumen.set({ ...resumenCompleto, es_supervisor: false });
      const fixture = TestBed.createComponent(FinanzasComponent);

      fixture.componentInstance.exportarCSV();

      const texto = await blobCapturado!.text();
      expect(texto).not.toContain('Generado por trabajador');
    });
  });
});
