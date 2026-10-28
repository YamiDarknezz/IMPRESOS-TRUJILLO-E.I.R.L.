import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WritableSignal, signal } from '@angular/core';
import { OrdenesService } from '../../core/services/ordenes.service';
import { SesionService } from '../../core/services/sesion.service';
import { ComprobantesService } from '../../core/services/comprobantes.service';
import { OrdenesComponent } from './ordenes';
import { Orden } from '../../core/models';
import { hidratarConfiguracion, reiniciarConfiguracion } from '../../core/estado/catalogos';
import { CATALOGOS_DE_PRUEBA, PARAMETROS_DE_PRUEBA } from '../../core/estado/catalogos.prueba';

function ordenBase(sobrescribe: Partial<Orden> = {}): Orden {
  return {
    id: 1,
    id_documento: 'C-0001',
    codigo: 'C-0001',
    tipo_documento: 'contrato',
    canal_ingreso: 'otro',
    unidad_negocio: 'imprenta',
    cliente_id: 1,
    cliente: 'Juan Pérez',
    direccion: '',
    telefono: '',
    descripcion: 'Banners',
    estado: 'pendiente',
    fecha_creacion: '2026-09-01',
    fecha_entrega: '2026-12-31',
    creado_por: 1,
    asignado_a: null,
    asignado: '',
    incluye_igv: true,
    subtotal: 100,
    igv: 18,
    items: [],
    ...sobrescribe,
  };
}

describe('OrdenesComponent', () => {
  let ordenesFalso: {
    ordenes: ReturnType<typeof signal<Orden[]>>;
    cargando: ReturnType<typeof signal<boolean>>;
    totalOrdenes: ReturnType<typeof signal<number | null>>;
    hayMasOrdenes: ReturnType<typeof signal<boolean>>;
    cargandoMasOrdenes: ReturnType<typeof signal<boolean>>;
    cargarMetricas: ReturnType<typeof vi.fn>;
    cargarMasOrdenes: ReturnType<typeof vi.fn>;
    enProceso: ReturnType<typeof signal<number>>;
    finalizadas: ReturnType<typeof signal<number>>;
    vencidas: ReturnType<typeof signal<number>>;
    porCobrar: ReturnType<typeof signal<number>>;
    cargar: ReturnType<typeof vi.fn>;
    recargar: ReturnType<typeof vi.fn>;
    local: ReturnType<typeof signal<string>>;
    soloPendientesHoy: ReturnType<typeof signal<boolean>>;
    desde: ReturnType<typeof signal<string>>;
    hasta: ReturnType<typeof signal<string>>;
    filtrarPor: ReturnType<typeof vi.fn>;
    entregarConSaldo: ReturnType<typeof vi.fn>;
    rollosDeOrden: ReturnType<typeof vi.fn>;
    cambiarEstado: ReturnType<typeof vi.fn>;
    asignar: ReturnType<typeof vi.fn>;
    cancelar: ReturnType<typeof vi.fn>;
    completar: ReturnType<typeof vi.fn>;
    confirmarPago: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    ordenesFalso = {
      ordenes: signal([ordenBase()]),
      cargando: signal(false),
      // La tabla viene paginada y las tarjetas salen del backend (#27).
      totalOrdenes: signal(120),
      hayMasOrdenes: signal(true),
      cargandoMasOrdenes: signal(false),
      cargarMetricas: vi.fn().mockResolvedValue(undefined),
      cargarMasOrdenes: vi.fn().mockResolvedValue(undefined),
      enProceso: signal(1),
      finalizadas: signal(0),
      vencidas: signal(0),
      porCobrar: signal(0),
      cargar: vi.fn().mockResolvedValue(undefined),
      recargar: vi.fn().mockResolvedValue(undefined),
      local: signal(''),
      soloPendientesHoy: signal(false),
      desde: signal(''),
      hasta: signal(''),
      filtrarPor: vi.fn((cambios: { desde?: string; hasta?: string }) => {
        if (cambios.desde !== undefined) ordenesFalso.desde.set(cambios.desde);
        if (cambios.hasta !== undefined) ordenesFalso.hasta.set(cambios.hasta);
        return Promise.resolve();
      }),
      entregarConSaldo: vi.fn().mockResolvedValue(undefined),
      rollosDeOrden: vi.fn().mockResolvedValue({ data: [], resumen: [] }),
      cambiarEstado: vi.fn().mockResolvedValue(undefined),
      asignar: vi.fn().mockResolvedValue(undefined),
      cancelar: vi.fn().mockResolvedValue(undefined),
      completar: vi.fn().mockResolvedValue(undefined),
      confirmarPago: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [OrdenesComponent],
      providers: [
        provideRouter([]),
        { provide: OrdenesService, useValue: ordenesFalso },
        {
          provide: ComprobantesService,
          useValue: {
            subirVarias: vi.fn().mockResolvedValue({ subidos: [], fallidos: [] }),
            urlDe: (c: { url: string }) => c.url,
            resumen: () => '',
          },
        },
        { provide: SesionService, useValue: { esSupervisor: signal(true), puedeVender: signal(true), puedeGestionarOrdenes: signal(true), usuarios: signal([]), puedeGestionar: () => true, puedeAvanzarEtapa: () => true } },
      ],
    });
  });

  it('al crearse, carga las órdenes y las métricas del panel', () => {
    TestBed.createComponent(OrdenesComponent);
    expect(ordenesFalso.cargar).toHaveBeenCalledTimes(1);
    // Las tarjetas ya no se calculan sobre la lista cargada: vienen del backend.
    expect(ordenesFalso.cargarMetricas).toHaveBeenCalledTimes(1);
  });

  it('cargarMas() pide el siguiente bloque de órdenes', () => {
    const componente = TestBed.createComponent(OrdenesComponent).componentInstance;

    componente.cargarMas();

    expect(ordenesFalso.cargarMasOrdenes).toHaveBeenCalledTimes(1);
  });

  it('ordenesFiltradas() aplica el filtro de estado y búsqueda combinados', () => {
    const fixture = TestBed.createComponent(OrdenesComponent);
    const componente = fixture.componentInstance;
    componente.filtroEstado.set('pendiente');
    componente.busqueda.set('juan');
    expect(componente.ordenesFiltradas()).toEqual([ordenBase()]);
    componente.busqueda.set('nadie');
    expect(componente.ordenesFiltradas()).toEqual([]);
  });

  it('limpiarFiltroFecha() vacía desde/hasta', () => {
    const fixture = TestBed.createComponent(OrdenesComponent);
    const componente = fixture.componentInstance;
    componente.desde.set('2026-01-01');
    componente.hasta.set('2026-01-31');
    componente.limpiarFiltroFecha();
    expect(componente.desde()).toBe('');
    expect(componente.hasta()).toBe('');
    expect(componente.hayFiltroFecha()).toBe(false);
    expect(ordenesFalso.filtrarPor).toHaveBeenCalledWith({ desde: '', hasta: '' });
  });

  it('envía el rango al servidor sin filtrar la página cargada localmente', () => {
    const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
    componente.cambiarFecha('hasta', '2026-10-20');
    expect(ordenesFalso.filtrarPor).toHaveBeenCalledWith({ hasta: '2026-10-20' });
    expect(componente.ordenesFiltradas()).toEqual([ordenBase()]);
  });

  describe('venta rápida / mostrador (#12)', () => {
    it('el botón abre y el componente avisa cuando se cierra', () => {
      ordenesFalso.ordenes.set([]); // solo interesa el modal, no las filas
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      expect(componente.ventaRapidaAbierta()).toBe(false);

      componente.ventaRapidaAbierta.set(true);
      fixture.detectChanges();
      const modal = fixture.nativeElement.querySelector('app-venta-rapida') as HTMLElement;
      expect(modal).not.toBeNull();

      (modal.querySelector('.modal-footer .btn-secondary') as HTMLButtonElement).click();
      expect(componente.ventaRapidaAbierta()).toBe(false);
    });
  });

  // Issue #72: la proforma se entrega antes de pagar, con un supervisor.
  describe('entrega con saldo de una proforma (#72)', () => {
    const conSaldo = (extra: Partial<Orden> = {}) =>
      ordenBase({
        estado: 'finalizada',
        tipo_documento: 'proforma',
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 50, saldo_pendiente: 50, metodo_pago_adelanto: 'efectivo', pagado_totalmente: false },
        ...extra,
      });

    it('un supervisor abre la autorización en vez de recibir el aviso de bloqueo', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      const orden = conSaldo();

      await componente.cambiarEstado(orden, 'entregada');

      expect(componente.ordenAEntregarConSaldo()).toBe(orden);
      expect(alertSpy).not.toHaveBeenCalled();
      expect(ordenesFalso.cambiarEstado).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('quien no es supervisor recibe el aviso y no se abre la autorización', async () => {
      TestBed.overrideProvider(SesionService, {
        useValue: { esSupervisor: signal(false), puedeVender: signal(true), puedeGestionarOrdenes: signal(true), usuarios: signal([]), puedeGestionar: () => true, puedeAvanzarEtapa: () => true },
      });
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;

      await componente.cambiarEstado(conSaldo(), 'entregada');

      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Solo un supervisor'));
      expect(componente.ordenAEntregarConSaldo()).toBeNull();
      alertSpy.mockRestore();
    });

    it('un contrato sigue sin poder entregarse antes de pagar, aunque quien pregunte sea supervisor', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;

      await componente.cambiarEstado(conSaldo({ tipo_documento: 'contrato' }), 'entregada');

      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('no está pagada en su totalidad'));
      expect(componente.ordenAEntregarConSaldo()).toBeNull();
      alertSpy.mockRestore();
    });

    it('confirmar exige el motivo', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      await componente.cambiarEstado(conSaldo(), 'entregada');
      componente.motivoEntrega.set('   ');

      await componente.confirmarEntregaConSaldo();

      expect(ordenesFalso.entregarConSaldo).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith('Indica el motivo por el que se entrega antes de que pague.');
      alertSpy.mockRestore();
    });

    it('confirmar manda la orden con el motivo recortado y cierra la autorización', async () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      const orden = conSaldo();
      await componente.cambiarEstado(orden, 'entregada');
      componente.motivoEntrega.set('  Orden de compra a 30 días ');

      await componente.confirmarEntregaConSaldo();

      expect(ordenesFalso.entregarConSaldo).toHaveBeenCalledWith(orden, 'Orden de compra a 30 días');
      expect(componente.ordenAEntregarConSaldo()).toBeNull();
    });

    it('si el servidor la rechaza, avisa y la autorización sigue abierta', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      ordenesFalso.entregarConSaldo.mockRejectedValue(new Error('Solo un supervisor'));
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      await componente.cambiarEstado(conSaldo(), 'entregada');
      componente.motivoEntrega.set('Pidió el gerente');

      await componente.confirmarEntregaConSaldo();

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(componente.ordenAEntregarConSaldo()).not.toBeNull();
      alertSpy.mockRestore();
    });
  });

  describe('rollos usados por el pedido (#71)', () => {
    it('abrirRollos() pide los cortes del pedido y los guarda', async () => {
      const respuesta = { data: [], resumen: [{ material: 'Lona', unidad: 'm', cantidad: 8 }] };
      ordenesFalso.rollosDeOrden.mockResolvedValue(respuesta);
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      const orden = ordenBase();

      await componente.abrirRollos(orden);

      expect(ordenesFalso.rollosDeOrden).toHaveBeenCalledWith(1);
      expect(componente.ordenRollos()).toBe(orden);
      expect(componente.rollos()).toEqual(respuesta);
      expect(componente.cargandoRollos()).toBe(false);
    });

    it('si falla, avisa y no deja el modal a medias', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      ordenesFalso.rollosDeOrden.mockRejectedValue(new Error('sin red'));
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;

      await componente.abrirRollos(ordenBase());

      expect(alertSpy).toHaveBeenCalledTimes(1);
      expect(componente.ordenRollos()).toBeNull();
      alertSpy.mockRestore();
    });

    it('cerrarRollos() limpia el pedido y los datos', async () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      await componente.abrirRollos(ordenBase());
      componente.cerrarRollos();
      expect(componente.ordenRollos()).toBeNull();
      expect(componente.rollos()).toBeNull();
    });
  });

  describe('actualizar()', () => {
    it('vuelve a pedir las órdenes y las métricas', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      ordenesFalso.cargarMetricas.mockClear();

      await fixture.componentInstance.actualizar();

      expect(ordenesFalso.recargar).toHaveBeenCalledTimes(1);
      expect(ordenesFalso.cargarMetricas).toHaveBeenCalledTimes(1);
    });

    it('si falla, avisa en vez de dejar el error sin atender', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      ordenesFalso.recargar.mockRejectedValue(new Error('sin red'));
      const fixture = TestBed.createComponent(OrdenesComponent);

      await fixture.componentInstance.actualizar();

      expect(alertSpy).toHaveBeenCalledTimes(1);
      alertSpy.mockRestore();
    });
  });

  describe('cambiarEstado()', () => {
    it('si el estado no cambia, no llama al servicio', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      await fixture.componentInstance.cambiarEstado(ordenBase({ estado: 'pendiente' }), 'pendiente');
      expect(ordenesFalso.cambiarEstado).not.toHaveBeenCalled();
    });

    it('a "entregada" sin estar pagada por completo, avisa y no llama al servicio', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        estado: 'finalizada',
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 50, saldo_pendiente: 50, metodo_pago_adelanto: 'efectivo', pagado_totalmente: false },
      });

      await fixture.componentInstance.cambiarEstado(orden, 'entregada');

      expect(ordenesFalso.cambiarEstado).not.toHaveBeenCalled();
      expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('no está pagada en su totalidad'));
      alertSpy.mockRestore();
    });

    it('a "entregada" ya pagada, pide confirmación antes de cambiar', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        estado: 'finalizada',
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 100, saldo_pendiente: 0, metodo_pago_adelanto: 'efectivo', pagado_totalmente: true },
      });

      await fixture.componentInstance.cambiarEstado(orden, 'entregada');

      expect(ordenesFalso.cambiarEstado).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('a un estado normal del pipeline, cambia directo sin confirmar', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({ estado: 'pendiente' });

      await fixture.componentInstance.cambiarEstado(orden, 'en_diseno');

      expect(ordenesFalso.cambiarEstado).toHaveBeenCalledWith(orden, 'en_diseno');
    });
  });

  // Issue #123: el local y "pendientes de hoy" se piden al servidor.
  describe('filtro por local (#123)', () => {
    it('elegir un local lo pide al servidor', () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;

      componente.cambiarLocal('gigantografias');

      expect(ordenesFalso.filtrarPor).toHaveBeenCalledWith({ local: 'gigantografias' });
    });

    it('"Todos los locales" quita el filtro', () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;

      componente.cambiarLocal('');

      expect(ordenesFalso.filtrarPor).toHaveBeenCalledWith({ local: '' });
    });

    it('"Pendientes de hoy" se activa y se desactiva', () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;

      componente.alternarPendientesHoy();
      expect(ordenesFalso.filtrarPor).toHaveBeenLastCalledWith({ soloPendientesHoy: true });

      ordenesFalso.soloPendientesHoy.set(true);
      componente.alternarPendientesHoy();
      expect(ordenesFalso.filtrarPor).toHaveBeenLastCalledWith({ soloPendientesHoy: false });
    });

    it('la barra de filtros tiene el selector de local y el botón de pendientes de hoy', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      // Corriendo todos los specs juntos las etiquetas importadas de los modelos quedan sin
      // resolver en el bundler del test-runner (ver el spec de contacto): se fijan aquí.
      Object.assign(fixture.componentInstance, {
        etiquetaUnidad: { imprenta: 'Imprenta', gigantografias: 'Gigantografías' },
        etiquetaEstado: { pendiente: 'Pendiente' },
        unidades: ['imprenta', 'gigantografias'],
      });
      fixture.componentInstance.cargando.set(false);
      fixture.detectChanges();

      const pagina = fixture.nativeElement as HTMLElement;
      const opciones = Array.from(
        pagina.querySelectorAll('select[name="filtroLocal"] option')
      ).map(o => o.textContent?.trim());

      expect(opciones).toEqual(['Todos los locales', 'Imprenta', 'Gigantografías']);
      expect(pagina.textContent).toContain('Pendientes de hoy');
    });
  });

  // Issue #122: el teléfono va junto al cliente; la asignación sigue, pero al final de la fila.
  describe('columna de contacto (#122)', () => {
    function pintar(soloVer: boolean) {
      ordenesFalso.ordenes.set([
        ordenBase({ id: 1, id_documento: 'ORD-000001', telefono: '924 943 790' }),
        ordenBase({ id: 2, id_documento: 'ORD-000002', telefono: '' }),
      ]);
      const fixture = TestBed.createComponent(OrdenesComponent);
      if (soloVer) (TestBed.inject(SesionService).esSupervisor as WritableSignal<boolean>).set(false);
      // Corriendo todos los specs juntos, el bundler del test-runner deja sin resolver
      // las etiquetas importadas de los modelos (pasa el spec solo): se fijan aquí para
      // que la prueba mire el contacto y no ese detalle del entorno.
      Object.assign(fixture.componentInstance, {
        etiquetaUnidad: { imprenta: 'Imprenta', gigantografias: 'Gigantografías' },
        etiquetaEstado: { pendiente: 'Pendiente' },
      });
      fixture.componentInstance.cargando.set(false);
      fixture.detectChanges();
      return fixture.nativeElement as HTMLElement;
    }

    const encabezados = (tabla: HTMLElement) =>
      Array.from(tabla.querySelectorAll('th')).map(th => th.textContent?.trim());

    it('muestra el teléfono de cada orden como enlace para llamar, justo después del cliente', () => {
      const tabla = pintar(false);
      const columnas = encabezados(tabla);

      expect(columnas.indexOf('Contacto')).toBe(columnas.indexOf('Cliente') + 1);

      const enlaces = tabla.querySelectorAll('a.enlace-telefono');
      expect(enlaces.length).toBe(1);
      expect(enlaces[0].textContent?.trim()).toBe('924 943 790');
      expect(enlaces[0].getAttribute('href')).toBe('tel:924 943 790');
    });

    it('la asignación sigue para supervisión, pero al final de la fila y no junto al cliente', () => {
      const columnas = encabezados(pintar(false));

      expect(columnas).toContain('Asignado');
      expect(columnas.indexOf('Asignado')).toBeGreaterThan(columnas.indexOf('Estado'));
      expect(columnas.indexOf('Asignado')).toBe(columnas.indexOf('Acciones') - 1);
    });

    it('quien no es supervisión no ve la columna de asignación', () => {
      expect(encabezados(pintar(true))).not.toContain('Asignado');
    });

    it('la búsqueda encuentra la orden por su teléfono', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      ordenesFalso.ordenes.set([
        ordenBase({ id: 1, id_documento: 'ORD-000001', telefono: '924 943 790' }),
        ordenBase({ id: 2, id_documento: 'ORD-000002', telefono: '987 654 321' }),
      ]);
      fixture.componentInstance.busqueda.set('924943');

      expect(fixture.componentInstance.ordenesFiltradas().map(o => o.id_documento)).toEqual(['ORD-000001']);
    });
  });

  // Issue #124: con el adelanto repartido, la lista muestra todos los métodos.
  describe('metodosDelAdelanto() (#124)', () => {
    const pago = (metodo: string, extra: object = {}) => ({
      id: 1, fecha: '2026-10-01', monto: 50, metodo, tipo: 'adelanto', ...extra,
    });
    const conPagos = (pagos: object[]) =>
      ordenBase({
        finanzas: {
          precio_total: 300, subtotal: 300, igv: 0, adelanto_pago: 150, saldo_pendiente: 150,
          metodo_pago_adelanto: 'efectivo', pagado_totalmente: false, pagos,
        } as never,
      });

    it('con partes muestra todos los métodos juntos', () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      Object.assign(componente, { etiquetaMetodo: () => ({ efectivo: 'Efectivo', yape_angel: 'Yape Ángel' }) });

      expect(componente.metodosDelAdelanto(conPagos([pago('efectivo'), pago('yape_angel')]))).toBe(
        'Efectivo + Yape Ángel'
      );
    });

    it('un adelanto observado no cuenta, y sin pagos usa el método guardado', () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      Object.assign(componente, { etiquetaMetodo: () => ({ efectivo: 'Efectivo', yape_angel: 'Yape Ángel' }) });

      expect(
        componente.metodosDelAdelanto(conPagos([pago('efectivo'), pago('yape_angel', { estado_pago: 'observado' })]))
      ).toBe('Efectivo');
      expect(componente.metodosDelAdelanto(conPagos([]))).toBe('Efectivo');
    });
  });

  it('asignar(): convierte el id de texto a número, o null si viene vacío', async () => {
    const fixture = TestBed.createComponent(OrdenesComponent);
    const orden = ordenBase();

    await fixture.componentInstance.asignar(orden, '5');
    expect(ordenesFalso.asignar).toHaveBeenCalledWith(orden, 5);

    await fixture.componentInstance.asignar(orden, '');
    expect(ordenesFalso.asignar).toHaveBeenCalledWith(orden, null);
  });

  it('cancelar(): pide confirmación antes de cancelar', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const fixture = TestBed.createComponent(OrdenesComponent);

    await fixture.componentInstance.cancelar(ordenBase());

    expect(ordenesFalso.cancelar).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });

  describe('reportar uso de materiales (completar)', () => {
    const ordenConMateriales = ordenBase({
      materiales: { estimados: [{ id_material: 1, nombre: 'Lona', cantidad: 10 }] },
    });

    it('abrirCompletar() precarga cantidad_real igual a la estimada', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      fixture.componentInstance.abrirCompletar(ordenConMateriales);
      expect(fixture.componentInstance.materialesComplecion()).toEqual([
        { id_material: 1, nombre: 'Lona', cantidad_estimada: 10, cantidad_real: 10 },
      ]);
    });

    it('sobrantes() detecta materiales usados de menos', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCompletar(ordenConMateriales);
      componente.materialesComplecion.update(lista =>
        lista.map(m => ({ ...m, cantidad_real: 7 })),
      );
      expect(componente.sobrantes()).toEqual([{ nombre: 'Lona', sobrante: 3 }]);
    });

    // Issue #29: el input mutaba el objeto del signal y `sobrantes()` quedaba
    // desactualizado, de modo que no se pedía confirmar la devolución al stock.
    it('cambiarCantidadReal() copia la lista: sobrantes() se recalcula', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCompletar(ordenConMateriales);
      const antes = componente.materialesComplecion();
      expect(componente.sobrantes()).toEqual([]);

      componente.cambiarCantidadReal(1, 4);

      expect(componente.sobrantes()).toEqual([{ nombre: 'Lona', sobrante: 6 }]);
      expect(componente.materialesComplecion()).not.toBe(antes);
      expect(antes[0].cantidad_real).toBe(10);
    });

    it('confirmarProduccion(): sin sobrantes, completa directo sin confirmar', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm');
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCompletar(ordenConMateriales);

      await componente.confirmarProduccion();

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(ordenesFalso.completar).toHaveBeenCalledWith(1, [{ material_id: 1, cantidad: 10 }]);
      expect(componente.ordenACompletar()).toBeNull();
      confirmSpy.mockRestore();
    });

    it('confirmarProduccion(): con sobrantes, pide confirmar antes de devolver stock', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCompletar(ordenConMateriales);
      componente.materialesComplecion.update(lista => lista.map(m => ({ ...m, cantidad_real: 5 })));

      await componente.confirmarProduccion();

      expect(ordenesFalso.completar).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });
  });

  describe('cobro de saldo', () => {
    it('abrirCobro() precarga el método del adelanto', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 50, saldo_pendiente: 50, metodo_pago_adelanto: 'yape', pagado_totalmente: false },
      });
      fixture.componentInstance.abrirCobro(orden);
      expect(fixture.componentInstance.metodoPago()).toBe('yape');
    });

    it('abrirCobro() precarga cualquiera de los dos Yape (#125)', () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 50, saldo_pendiente: 50, metodo_pago_adelanto: 'yape_angel', pagado_totalmente: false },
      });
      fixture.componentInstance.abrirCobro(orden);
      expect(fixture.componentInstance.metodoPago()).toBe('yape_angel');
    });

    it('abrirCobro(): si el adelanto fue el Yape de antes, que ya no se ofrece, parte de efectivo', () => {
      hidratarConfiguracion({ parametros: PARAMETROS_DE_PRUEBA, catalogos: CATALOGOS_DE_PRUEBA });
      const fixture = TestBed.createComponent(OrdenesComponent);
      const orden = ordenBase({
        finanzas: { precio_total: 100, subtotal: 85, igv: 15, adelanto_pago: 50, saldo_pendiente: 50, metodo_pago_adelanto: 'yape', pagado_totalmente: false },
      });
      fixture.componentInstance.abrirCobro(orden);
      expect(fixture.componentInstance.metodoPago()).toBe('efectivo');
      reiniciarConfiguracion();
    });

    it('confirmarPago(): sin orden seleccionada, no hace nada', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      await fixture.componentInstance.confirmarPago();
      expect(ordenesFalso.confirmarPago).not.toHaveBeenCalled();
    });

    it('confirmarPago(): manda método y referencia, y cierra el modal', async () => {
      const fixture = TestBed.createComponent(OrdenesComponent);
      const componente = fixture.componentInstance;
      componente.abrirCobro(ordenBase());
      componente.referenciaPago.set('  OP-99  ');
      componente.descripcionPago.set('  Abono de la semana ');

      await componente.confirmarPago();

      expect(ordenesFalso.confirmarPago).toHaveBeenCalledWith(1, 'efectivo', 'OP-99', 'Abono de la semana');
      expect(componente.ordenACobrar()).toBeNull();
    });

    // Issue #110: cada cobro nuevo parte sin la descripción del anterior.
    it('abrirCobro() limpia la descripción del cobro anterior', () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      componente.abrirCobro(ordenBase());
      componente.descripcionPago.set('algo');

      componente.abrirCobro(ordenBase());

      expect(componente.descripcionPago()).toBe('');
    });

    it('el historial de pagos se abre y se cierra por orden', () => {
      const componente = TestBed.createComponent(OrdenesComponent).componentInstance;
      const orden = ordenBase();
      componente.abrirHistorial(orden);
      expect(componente.ordenHistorial()).toBe(orden);
      componente.cerrarHistorial();
      expect(componente.ordenHistorial()).toBeNull();
    });
  });

  // Issue #38: todos los modales son diálogos accesibles que se cierran con Escape.
  describe('modales (#38)', () => {
    function conOrdenesVacias() {
      ordenesFalso.ordenes.set([]); // solo interesa el modal, no las filas
      return TestBed.createComponent(OrdenesComponent);
    }
    function pulsarEscape(fixture: { detectChanges(): void }) {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
      fixture.detectChanges();
    }

    it('reportar uso de materiales: es un diálogo y Escape lo cierra', () => {
      const fixture = conOrdenesVacias();
      fixture.componentInstance.abrirCompletar(ordenBase({ materiales: { estimados: [] } }));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();

      pulsarEscape(fixture);

      expect(fixture.componentInstance.ordenACompletar()).toBeNull();
    });

    it('confirmar pago: Escape lo cierra', () => {
      const fixture = conOrdenesVacias();
      fixture.componentInstance.abrirCobro(ordenBase());
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();

      pulsarEscape(fixture);

      expect(fixture.componentInstance.ordenACobrar()).toBeNull();
    });

    it('capturas de pago: Escape lo cierra', () => {
      const fixture = conOrdenesVacias();
      fixture.componentInstance.capturasVisibles.set(ordenBase({ comprobantes: [] }));
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('[role="dialog"]')).not.toBeNull();

      pulsarEscape(fixture);

      expect(fixture.componentInstance.capturasVisibles()).toBeNull();
    });

    it('venta rápida: Escape lo cierra', () => {
      const fixture = conOrdenesVacias();
      fixture.componentInstance.ventaRapidaAbierta.set(true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-venta-rapida [role="dialog"]')).not.toBeNull();

      pulsarEscape(fixture);

      expect(fixture.componentInstance.ventaRapidaAbierta()).toBe(false);
    });
  });
});
