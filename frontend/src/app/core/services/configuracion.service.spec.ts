import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ConfiguracionService } from './configuracion.service';
import { igvPorcentaje, reiniciarConfiguracion } from '../estado/catalogos';
import { CATALOGOS_DE_PRUEBA, PARAMETROS_DE_PRUEBA } from '../estado/catalogos.prueba';

describe('ConfiguracionService (#54)', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn> };
  let servicio: ConfiguracionService;

  beforeEach(() => {
    reiniciarConfiguracion();
    apiFalsa = { get: vi.fn().mockResolvedValue({ status: 'success', data: { parametros: PARAMETROS_DE_PRUEBA, catalogos: CATALOGOS_DE_PRUEBA } }) };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(ConfiguracionService);
  });

  it('cargar() trae los parámetros y catálogos del servidor', async () => {
    await servicio.cargar();

    expect(apiFalsa.get).toHaveBeenCalledWith('/api/configuracion');
    expect(igvPorcentaje()).toBe(18);
  });

  it('pide la configuración una sola vez', async () => {
    await servicio.cargar();
    await servicio.cargar();

    expect(apiFalsa.get).toHaveBeenCalledTimes(1);
  });

  it('si el servidor no responde, la pantalla sigue funcionando', async () => {
    apiFalsa.get.mockRejectedValue(new Error('sin red'));

    await expect(servicio.cargar(true)).resolves.toBeUndefined();

    // Se conserva lo último que se supo, no se queda en blanco.
    expect(igvPorcentaje()).toBe(18);
  });
});
