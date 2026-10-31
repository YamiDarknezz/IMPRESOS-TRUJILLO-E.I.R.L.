import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SesionService } from '../../core/services/sesion.service';
import { ThemeService } from '../../core/services/theme.service';
import { ShellComponent } from './shell';

describe('ShellComponent', () => {
  let sesionFalsa: {
    cargar: ReturnType<typeof vi.fn>;
    puedeGestionarOrdenes: ReturnType<typeof signal<boolean>>;
    esSupervisor: ReturnType<typeof signal<boolean>>;
    esAdmin: ReturnType<typeof signal<boolean>>;
  };
  let authFalso: { cerrarSesion: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    sesionFalsa = {
      cargar: vi.fn().mockResolvedValue(undefined),
      puedeGestionarOrdenes: signal(false),
      esSupervisor: signal(false),
      esAdmin: signal(false),
    };
    authFalso = { cerrarSesion: vi.fn() };
    TestBed.configureTestingModule({
      imports: [ShellComponent],
      providers: [
        provideRouter([]),
        { provide: SesionService, useValue: sesionFalsa },
        { provide: AuthService, useValue: authFalso },
        { provide: ThemeService, useValue: { theme: signal('light'), toggle: vi.fn() } },
      ],
    });
  });

  it('al crearse, carga la sesión', () => {
    TestBed.createComponent(ShellComponent);
    expect(sesionFalsa.cargar).toHaveBeenCalledTimes(1);
  });

  it('el menú de operación es el mismo para todo el personal', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    expect(fixture.componentInstance.menuOperacion.map(o => o.ruta)).toEqual([
      '/ordenes', '/caja', '/inventario',
    ]);
  });

  describe('grupos del menú, según permisos', () => {
    it('mantiene Finanzas para el personal y oculta los grupos sin opciones', () => {
      const fixture = TestBed.createComponent(ShellComponent);
      const componente = fixture.componentInstance;
      expect(componente.menuComercial()).toEqual([]);
      expect(componente.menuAnalitica()).toEqual([]);
      expect(componente.menuAdministracion()).toEqual([]);
      expect(componente.gruposMenu().map(g => [g.clave, g.opciones.map(o => o.ruta)])).toEqual([
        ['operacion', ['/ordenes', '/caja', '/inventario']],
        ['finanzas', ['/finanzas']],
      ]);
    });

    it('quien gestiona órdenes ve "Clientes"', () => {
      sesionFalsa.puedeGestionarOrdenes.set(true);
      const fixture = TestBed.createComponent(ShellComponent);
      expect(fixture.componentInstance.menuComercial().map(o => o.ruta)).toEqual(['/clientes']);
    });

    it('la supervisión ve BI y Cuentas por cobrar, no el catálogo admin-only', () => {
      sesionFalsa.esSupervisor.set(true);
      const fixture = TestBed.createComponent(ShellComponent);
      const componente = fixture.componentInstance;
      expect(componente.menuAnalitica().map(o => o.ruta)).toEqual(['/bi', '/ia']);
      expect(componente.menuFinanzas().map(o => o.ruta)).toEqual(['/finanzas', '/cuentas-por-cobrar']);
      expect(componente.menuComercial().map(o => o.ruta)).toEqual([]);
    });

    it('el admin ve Productos, Unidades, Usuarios y Auditoría', () => {
      sesionFalsa.esAdmin.set(true);
      const fixture = TestBed.createComponent(ShellComponent);
      const componente = fixture.componentInstance;
      expect(componente.menuComercial().map(o => o.ruta)).toEqual(['/productos']);
      expect(componente.menuAdministracion().map(o => o.ruta)).toEqual(['/unidades', '/usuarios', '/auditoria']);
    });

    it('ordena los grupos por tarea para quien tiene todos los permisos', () => {
      sesionFalsa.puedeGestionarOrdenes.set(true);
      sesionFalsa.esSupervisor.set(true);
      sesionFalsa.esAdmin.set(true);
      const fixture = TestBed.createComponent(ShellComponent);
      expect(fixture.componentInstance.gruposMenu().map(g => [g.clave, g.opciones.map(o => o.ruta)])).toEqual([
        ['operacion', ['/ordenes', '/caja', '/inventario']],
        ['comercial', ['/clientes', '/productos']],
        ['finanzas', ['/finanzas', '/cuentas-por-cobrar']],
        ['analitica', ['/bi', '/ia']],
        ['administracion', ['/unidades', '/usuarios', '/auditoria']],
      ]);
    });
  });

  it('alternarColapsado(): alterna y persiste la preferencia', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    const componente = fixture.componentInstance;
    expect(componente.colapsado()).toBe(false);

    componente.alternarColapsado();
    expect(componente.colapsado()).toBe(true);
    expect(localStorage.getItem('it-sidebar-colapsado')).toBe('1');

    componente.alternarColapsado();
    expect(componente.colapsado()).toBe(false);
    expect(localStorage.getItem('it-sidebar-colapsado')).toBe('0');
  });

  it('arranca colapsado si así quedó guardado', () => {
    localStorage.setItem('it-sidebar-colapsado', '1');
    const fixture = TestBed.createComponent(ShellComponent);
    expect(fixture.componentInstance.colapsado()).toBe(true);
  });

  it('cerrarCajon() cierra el cajón móvil', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.componentInstance.cajonAbierto.set(true);
    fixture.componentInstance.cerrarCajon();
    expect(fixture.componentInstance.cajonAbierto()).toBe(false);
  });

  it('cerrarSesion() delega en AuthService', () => {
    const fixture = TestBed.createComponent(ShellComponent);
    fixture.componentInstance.cerrarSesion();
    expect(authFalso.cerrarSesion).toHaveBeenCalledTimes(1);
  });
});
