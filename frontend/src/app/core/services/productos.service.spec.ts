import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { DatosProducto, ProductosService } from './productos.service';

const datosPropio: DatosProducto = {
  nombre: 'Banner 1x1',
  tipo: 'propio',
  precio_base: 50,
  notas: '',
  materiales: [{ id_material: 3, nombre: 'Lona banner 13 oz', cantidad: 1 }],
};

describe('ProductosService', () => {
  let apiFalsa: { get: ReturnType<typeof vi.fn>; post: ReturnType<typeof vi.fn>; patch: ReturnType<typeof vi.fn>; delete: ReturnType<typeof vi.fn> };
  let servicio: ProductosService;

  beforeEach(() => {
    apiFalsa = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
    TestBed.configureTestingModule({ providers: [{ provide: ApiService, useValue: apiFalsa }] });
    servicio = TestBed.inject(ProductosService);
    apiFalsa.get.mockResolvedValue({ status: 'success', data: [] });
  });

  it('crear(): un producto propio manda la receta traducida a material_id/cantidad', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });

    await servicio.crear(datosPropio);

    expect(apiFalsa.post).toHaveBeenCalledWith('/api/productos', {
      nombre: 'Banner 1x1',
      tipo: 'propio',
      precio_base: 50,
      notas: '',
      receta: [{ material_id: 3, cantidad: 1 }],
    });
  });

  it('crear(): un producto de servicio no manda receta aunque tenga materiales cargados', async () => {
    apiFalsa.post.mockResolvedValue({ status: 'success', data: {} });

    await servicio.crear({ ...datosPropio, tipo: 'servicio' });

    expect(apiFalsa.post).toHaveBeenCalledWith(
      '/api/productos',
      expect.objectContaining({ receta: [] }),
    );
  });

  it('actualizar() usa PATCH con la misma traducción de receta', async () => {
    apiFalsa.patch.mockResolvedValue({ status: 'success', data: {} });

    await servicio.actualizar(7, datosPropio);

    expect(apiFalsa.patch).toHaveBeenCalledWith(
      '/api/productos/7',
      expect.objectContaining({ receta: [{ material_id: 3, cantidad: 1 }] }),
    );
  });

  it('desactivar() usa DELETE', async () => {
    apiFalsa.delete.mockResolvedValue({ status: 'success', data: {} });

    await servicio.desactivar(7);

    expect(apiFalsa.delete).toHaveBeenCalledWith('/api/productos/7');
  });
});
