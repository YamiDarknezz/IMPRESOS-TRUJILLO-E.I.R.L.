import { TestBed } from '@angular/core/testing';
import { FinanzasService } from '../../core/services/finanzas.service';
import { CuentasPorCobrar } from '../../core/models';
import { CuentasPorCobrarComponent, TRAMOS } from './cuentas-por-cobrar';

const cuentas: CuentasPorCobrar = {
  fecha_corte: '2026-10-03',
  solo_proformas: true,
  total_pendiente: 150,
  tramos: { d0_30: 50, d31_60: 0, d61_90: 0, d90_mas: 100 },
  clientes: [
    {
      cliente_id: 7,
      cliente: 'Cámara de Comercio',
      es_corporativo: true,
      saldo_pendiente: 150,
      dias_mayor_antiguedad: 120,
      tramos: { d0_30: 50, d31_60: 0, d61_90: 0, d90_mas: 100 },
      ordenes: [
        { orden_id: 2, codigo: 'ORD-000002', estado: 'entregada', total: 200, saldo_pendiente: 100, fecha_referencia: '2026-06-05', dias: 120, tramo: 'd90_mas', entregada_con_saldo: true, entrega_autorizada_por: 'Ana', entrega_motivo: 'Orden de compra, "30 días"' },
        { orden_id: 3, codigo: 'ORD-000003', estado: 'finalizada', total: 100, saldo_pendiente: 50, fecha_referencia: '2026-09-23', dias: 10, tramo: 'd0_30', entregada_con_saldo: false, entrega_autorizada_por: null, entrega_motivo: '' },
      ],
    },
  ],
};

describe('CuentasPorCobrarComponent (#72)', () => {
  let finanzasFalso: { cuentasPorCobrar: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    finanzasFalso = { cuentasPorCobrar: vi.fn().mockResolvedValue(cuentas) };
    TestBed.configureTestingModule({
      imports: [CuentasPorCobrarComponent],
      providers: [{ provide: FinanzasService, useValue: finanzasFalso }],
    });
  });

  it('al crearse, carga solo las proformas', async () => {
    const fixture = TestBed.createComponent(CuentasPorCobrarComponent);
    await fixture.whenStable();
    expect(finanzasFalso.cuentasPorCobrar).toHaveBeenCalledWith(true);
    expect(fixture.componentInstance.datos()).toEqual(cuentas);
  });

  it('cambiarAlcance() vuelve a pedir con el alcance elegido', async () => {
    const componente = TestBed.createComponent(CuentasPorCobrarComponent).componentInstance;
    finanzasFalso.cuentasPorCobrar.mockClear();

    componente.cambiarAlcance(false);

    expect(componente.soloProformas()).toBe(false);
    expect(finanzasFalso.cuentasPorCobrar).toHaveBeenCalledWith(false);
  });

  it('si falla, avisa en vez de dejar la pantalla en blanco', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const fixture = TestBed.createComponent(CuentasPorCobrarComponent);
    await fixture.whenStable();
    finanzasFalso.cuentasPorCobrar.mockRejectedValue(new Error('sin red'));

    await fixture.componentInstance.cargar();

    expect(alertSpy).toHaveBeenCalledTimes(1);
    expect(fixture.componentInstance.cargando()).toBe(false);
    alertSpy.mockRestore();
  });

  it('alternar() despliega y recoge el detalle de un cliente', () => {
    const componente = TestBed.createComponent(CuentasPorCobrarComponent).componentInstance;
    componente.alternar(7);
    expect(componente.abiertos().has(7)).toBe(true);
    componente.alternar(7);
    expect(componente.abiertos().has(7)).toBe(false);
  });

  it('muestra los tramos y el detalle desplegado', async () => {
    const fixture = TestBed.createComponent(CuentasPorCobrarComponent);
    await fixture.whenStable();
    fixture.componentInstance.alternar(7);
    fixture.detectChanges();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    for (const tramo of TRAMOS) expect(texto).toContain(tramo.etiqueta);
    expect(texto).toContain('Cámara de Comercio');
    expect(texto).toContain('ORD-000002');
    expect(texto).toContain('Autorizó Ana');
  });

  it('exportarCSV() baja una fila por orden, con comillas escapadas', async () => {
    // Igual que en Finanzas: se deja correr el helper y se intercepta el Blob.
    const crear = URL.createObjectURL;
    const revocar = URL.revokeObjectURL;
    let blob: Blob | undefined;
    let nombre: string | undefined;
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, 'download', 'set').mockImplementation(function (
      this: HTMLAnchorElement,
      valor: string,
    ) {
      nombre = valor;
    });
    URL.createObjectURL = ((b: Blob) => {
      blob = b;
      return 'blob:falso';
    }) as typeof URL.createObjectURL;
    URL.revokeObjectURL = () => {};

    try {
      const fixture = TestBed.createComponent(CuentasPorCobrarComponent);
      await fixture.whenStable();

      fixture.componentInstance.exportarCSV();

      expect(nombre).toBe('cuentas-por-cobrar-2026-10-03.csv');
      const texto = await blob!.text();
      expect(texto).toContain('ORD-000002');
      expect(texto).toContain('ORD-000003');
      expect(texto).toContain('Más de 90 días');
      // Las comillas del motivo se duplican y el campo va entrecomillado.
      expect(texto).toContain('"Orden de compra, ""30 días""' + '"');
    } finally {
      URL.createObjectURL = crear;
      URL.revokeObjectURL = revocar;
      vi.restoreAllMocks();
    }
  });
});
