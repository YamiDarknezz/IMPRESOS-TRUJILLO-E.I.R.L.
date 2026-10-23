import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BiComponent, fechaPeru } from './bi';
import { ApiService } from '../../core/services/api.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { ResumenBI } from '../../core/models/bi.model';

describe('BI gerencial', () => {
  let get: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    get = vi.fn().mockResolvedValue({ data: null });
    TestBed.configureTestingModule({
      imports: [BiComponent],
      providers: [provideRouter([]), { provide: ApiService, useValue: { get } },
        { provide: OrdenesService, useValue: { obtener: vi.fn() } }],
    });
  });

  it('usa el día peruano aunque en UTC ya sea mañana', () => {
    expect(fechaPeru(new Date('2026-10-23T04:59:00Z'))).toBe('2026-10-22');
    expect(fechaPeru(new Date('2026-10-23T05:00:00Z'))).toBe('2026-10-23');
  });

  it('envía línea/canal y no deja que una respuesta vieja reemplace un filtro nuevo', async () => {
    const c = TestBed.createComponent(BiComponent).componentInstance;
    await Promise.resolve();
    let terminar!: (valor: unknown) => void;
    get.mockReturnValueOnce(new Promise(resolve => terminar = resolve));
    const vieja = c.cargar();
    const nueva = { fecha_corte: '2026-10-22' } as ResumenBI;
    get.mockResolvedValueOnce({ data: nueva });
    c.unidad.set('imprenta');
    c.canal.set('whatsapp');
    await c.cargar();
    terminar({ data: { fecha_corte: 'respuesta vieja' } });
    await vieja;
    expect(c.datos()).toBe(nueva);
    expect(get.mock.lastCall?.[0]).toContain('unidad_negocio=imprenta');
    expect(get.mock.lastCall?.[0]).toContain('canal_ingreso=whatsapp');
    expect(c.cargando()).toBe(false);
  });

  it('un rango inválido vacía el resultado y no consulta al servidor', async () => {
    const c = TestBed.createComponent(BiComponent).componentInstance;
    await Promise.resolve();
    get.mockClear();
    c.desde.set('2026-10-22');
    c.hasta.set('2026-10-20');
    await c.cargar();
    expect(get).not.toHaveBeenCalled();
    expect(c.datos()).toBeNull();
    expect(c.error()).toContain('rango válido');
  });

  it('muestra errores recuperables dentro de la página', async () => {
    const fixture = TestBed.createComponent(BiComponent);
    await Promise.resolve();
    get.mockRejectedValueOnce({ error: { detail: 'No disponible temporalmente' } });
    await fixture.componentInstance.cargar();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('No disponible temporalmente');
    expect(fixture.componentInstance.cargando()).toBe(false);
  });
});
