import { TestBed } from '@angular/core/testing';
import { OrdenesService } from '../../../core/services/ordenes.service';
import { VentaRapidaComponent } from './venta-rapida';

describe('VentaRapidaComponent', () => {
  let ordenesFalso: { crearVentaRapida: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    ordenesFalso = { crearVentaRapida: vi.fn().mockResolvedValue({}) };
    TestBed.configureTestingModule({
      imports: [VentaRapidaComponent],
      providers: [{ provide: OrdenesService, useValue: ordenesFalso }],
    });
  });

  it('guardar(): exige descripción', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fixture = TestBed.createComponent(VentaRapidaComponent);
    fixture.componentInstance.monto.set(20);

    await fixture.componentInstance.guardar();

    expect(ordenesFalso.crearVentaRapida).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Ingresa la descripción del servicio o producto rápido.');
    alertSpy.mockRestore();
  });

  it('guardar(): exige un monto mayor a 0', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const componente = TestBed.createComponent(VentaRapidaComponent).componentInstance;
    componente.descripcion.set('Copias');
    componente.monto.set(0);

    await componente.guardar();

    expect(ordenesFalso.crearVentaRapida).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith('Ingresa un monto válido mayor a 0.');
    alertSpy.mockRestore();
  });

  it('guardar(): con datos válidos crea la venta con los valores del formulario y se cierra', async () => {
    const componente = TestBed.createComponent(VentaRapidaComponent).componentInstance;
    const cerrado = vi.fn();
    componente.cerrado.subscribe(cerrado);
    componente.descripcion.set('  Copias  ');
    componente.monto.set(15);
    componente.metodo.set('yape');
    componente.referencia.set(' 987654321 ');

    await componente.guardar();

    expect(ordenesFalso.crearVentaRapida).toHaveBeenCalledWith({
      descripcion: 'Copias',
      monto_total: 15,
      metodo_pago: 'yape',
      unidad_negocio: 'imprenta',
      cliente_nombre: 'Cliente Mostrador',
      referencia: '987654321',
    });
    expect(cerrado).toHaveBeenCalledTimes(1);
  });

  it('guardar(): si el servidor falla, avisa y el formulario sigue abierto', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    ordenesFalso.crearVentaRapida.mockRejectedValue(new Error('sin red'));
    const componente = TestBed.createComponent(VentaRapidaComponent).componentInstance;
    const cerrado = vi.fn();
    componente.cerrado.subscribe(cerrado);
    componente.descripcion.set('Copias');
    componente.monto.set(15);

    await componente.guardar();

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(cerrado).not.toHaveBeenCalled();
    expect(componente.guardando()).toBe(false);
    alertSpy.mockRestore();
  });

  it('cerrar(): emite cerrado sin crear nada', () => {
    const componente = TestBed.createComponent(VentaRapidaComponent).componentInstance;
    const cerrado = vi.fn();
    componente.cerrado.subscribe(cerrado);

    componente.cerrar();

    expect(cerrado).toHaveBeenCalledTimes(1);
    expect(ordenesFalso.crearVentaRapida).not.toHaveBeenCalled();
  });
});
