import { TestBed } from '@angular/core/testing';
import { ApiService } from '../../core/services/api.service';
import { EstadoIA, IaComponent } from './ia';

describe('Pronóstico de pedidos', () => {
  let get: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    get = vi.fn();
    TestBed.configureTestingModule({ imports: [IaComponent],
      providers: [{ provide: ApiService, useValue: { get } }] });
  });

  it('explica la falta de datos sin inventar predicciones', async () => {
    get.mockResolvedValue({ data: { disponible: false, evaluacion: null, pronostico: null,
      aviso: 'Historial insuficiente' } satisfies EstadoIA });
    const fixture = TestBed.createComponent(IaComponent);
    await Promise.resolve();
    fixture.detectChanges();
    expect(get).toHaveBeenCalledWith('/api/ia/pronostico');
    expect(fixture.nativeElement.textContent).toContain('Historial insuficiente');
  });

  it('muestra método, fechas y valor de pedidos sin confundirlo con cobros', async () => {
    get.mockResolvedValue({ data: { disponible: true, evaluacion: null,
      pronostico: { corte: '2026-10-30', metodo: 'media_7', supuesto_domingo_cerrado: true,
        valor_es_cobro: false, dias: [{ fecha: '2026-10-31', pedidos: 12, valor_pedidos_pen: 240 }] }
    } satisfies EstadoIA });
    const fixture = TestBed.createComponent(IaComponent);
    await Promise.resolve();
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent;
    expect(texto).toContain('Media móvil de 7 días');
    expect(texto).toContain('S/ 240.00');
    expect(texto).toContain('No representa ventas confirmadas');
  });

  it('permite reintentar si el servidor falla', async () => {
    get.mockRejectedValueOnce(new Error('Sin conexión')).mockResolvedValueOnce({ data: {
      disponible: false, evaluacion: null, pronostico: null } });
    const fixture = TestBed.createComponent(IaComponent);
    await Promise.resolve();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeTruthy();
    await fixture.componentInstance.cargar();
    expect(fixture.componentInstance.error()).toBe('');
  });
});
