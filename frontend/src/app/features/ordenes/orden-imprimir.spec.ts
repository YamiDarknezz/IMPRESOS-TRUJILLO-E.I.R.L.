import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { OrdenesService } from '../../core/services/ordenes.service';
import { hidratarConfiguracion, reiniciarConfiguracion } from '../../core/estado/catalogos';
import { CATALOGOS_DE_PRUEBA, PARAMETROS_DE_PRUEBA } from '../../core/estado/catalogos.prueba';
import { Orden } from '../../core/models';
import { OrdenImprimirComponent } from './orden-imprimir';

const EMPRESA = {
  razon_social: 'IMPRESOS TRUJILLO E.I.R.L.',
  ruc: '20602572952',
  direccion: 'JR. SIMON BOLIVAR NRO. 945',
  telefono: '924 943 790',
  horario: 'Lunes a sábado',
};

function orden(sobrescribe: Partial<Orden> = {}): Orden {
  return {
    id: 5, id_documento: 'ORD-000005', codigo: 'ORD-000005', tipo_documento: 'contrato', canal_ingreso: 'whatsapp',
    unidad_negocio: 'gigantografias', cliente_id: 1, cliente: 'Juan Pérez', direccion: 'Av. España 123', telefono: '999111222',
    descripcion: 'Banner del evento', estado: 'pendiente', fecha_creacion: '2026-09-01T10:00:00Z', fecha_entrega: '2026-12-31',
    creado_por: 1, asignado_a: null, asignado: '', incluye_igv: true, subtotal: 100, igv: 18,
    items: [{ id: 1, descripcion: 'Banner 3x2', ancho_m: 3, alto_m: 2, cantidad: 1, precio_unitario: 100, importe: 100 }],
    finanzas: {
      precio_total: 118, subtotal: 100, igv: 18, adelanto_pago: 60, saldo_pendiente: 58, metodo_pago_adelanto: 'yape', pagado_totalmente: false,
      pagos: [
        { id: 1, fecha: '2026-09-01T10:00:00Z', monto: 60, metodo: 'yape', tipo: 'adelanto', descripcion: 'Adelanto del banner', estado_pago: 'conforme' },
        { id: 2, fecha: '2026-09-02T10:00:00Z', monto: 99, metodo: 'efectivo', tipo: 'saldo', descripcion: 'No llegó', estado_pago: 'observado' },
      ],
    },
    ...sobrescribe,
  };
}

describe('OrdenImprimirComponent (#68)', () => {
  let ordenesFalso: { obtener: ReturnType<typeof vi.fn> };

  function montar() {
    const fixture = TestBed.createComponent(OrdenImprimirComponent);
    return fixture;
  }

  beforeEach(() => {
    hidratarConfiguracion({ parametros: PARAMETROS_DE_PRUEBA, catalogos: CATALOGOS_DE_PRUEBA, empresa: EMPRESA });
    ordenesFalso = { obtener: vi.fn().mockResolvedValue(orden()) };
    TestBed.configureTestingModule({
      imports: [OrdenImprimirComponent],
      providers: [
        provideRouter([]),
        { provide: OrdenesService, useValue: ordenesFalso },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: '5' }) } } },
      ],
    });
  });

  afterEach(() => reiniciarConfiguracion());

  it('pide la orden de la ruta, no del listado', async () => {
    const fixture = montar();
    await fixture.whenStable();
    expect(ordenesFalso.obtener).toHaveBeenCalledWith(5);
    expect(fixture.componentInstance.orden()?.codigo).toBe('ORD-000005');
  });

  it('muestra los datos de la empresa que publica el servidor, el cliente y los montos', async () => {
    const fixture = montar();
    await fixture.whenStable();
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('IMPRESOS TRUJILLO E.I.R.L.');
    expect(texto).toContain('RUC 20602572952');
    expect(texto).toContain('JR. SIMON BOLIVAR NRO. 945');
    expect(texto).toContain('Contrato');
    expect(texto).toContain('N° ORD-000005');
    expect(texto).toContain('Juan Pérez');
    expect(texto).toContain('Av. España 123');
    expect(texto).toContain('3 × 2 m');
    expect(texto).toContain('WhatsApp');
    expect(texto).toContain('S/ 118.00');
    expect(texto).toContain('S/ 58.00');
  });

  it('en los pagos solo salen los que cuentan como dinero recibido', async () => {
    const fixture = montar();
    await fixture.whenStable();
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Adelanto: Adelanto del banner');
    expect(texto).not.toContain('No llegó');
    expect(fixture.componentInstance.pagosConformes().map(p => p.id)).toEqual([1]);
  });

  it('una proforma se rotula como proforma', async () => {
    ordenesFalso.obtener.mockResolvedValue(orden({ tipo_documento: 'proforma' }));
    const fixture = montar();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Proforma');
  });

  it('sin líneas de detalle no dibuja la tabla de ítems', async () => {
    ordenesFalso.obtener.mockResolvedValue(orden({ items: [] }));
    const fixture = montar();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.componentInstance.tieneItems()).toBe(false);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Banner del evento');
  });

  it('si la entrega se autorizó con saldo, el documento lo dice', async () => {
    ordenesFalso.obtener.mockResolvedValue(
      orden({ entrega_autorizada: { por: 'Ana', en: '2026-09-10T10:00:00Z', motivo: 'Orden de compra' } })
    );
    const fixture = montar();
    await fixture.whenStable();
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('autorizada antes del pago total por Ana');
  });

  it('si no se puede cargar, lo dice en vez de dejar la hoja en blanco', async () => {
    ordenesFalso.obtener.mockRejectedValue(new Error('boom'));
    const fixture = montar();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.error()).toBe('No se pudo cargar la orden.');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No se pudo cargar la orden.');
    expect((fixture.nativeElement as HTMLElement).querySelector('.documento')).toBeNull();
  });

  it('imprimir() abre el diálogo de impresión del navegador', async () => {
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {});
    const fixture = montar();
    await fixture.whenStable();

    fixture.componentInstance.imprimir();

    expect(imprimir).toHaveBeenCalledTimes(1);
    imprimir.mockRestore();
  });
});
