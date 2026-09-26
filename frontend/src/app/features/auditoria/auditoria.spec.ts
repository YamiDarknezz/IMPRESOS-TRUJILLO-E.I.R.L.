import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { AuditoriaService } from '../../core/services/auditoria.service';
import { AuditoriaComponent } from './auditoria';
import { EntradaAuditoria } from '../../core/models';

describe('AuditoriaComponent', () => {
  let servicioFalso: {
    entradas: ReturnType<typeof signal<EntradaAuditoria[]>>;
    cargando: ReturnType<typeof signal<boolean>>;
    sinPermiso: ReturnType<typeof signal<boolean>>;
    cargar: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    servicioFalso = {
      entradas: signal([]),
      cargando: signal(false),
      sinPermiso: signal(false),
      cargar: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [AuditoriaComponent],
      providers: [{ provide: AuditoriaService, useValue: servicioFalso }],
    });
  });

  it('al crearse, pide cargar el historial', () => {
    TestBed.createComponent(AuditoriaComponent);
    expect(servicioFalso.cargar).toHaveBeenCalledTimes(1);
  });

  it('etiquetaDeAccion(): usa la etiqueta legible cuando existe', () => {
    const fixture = TestBed.createComponent(AuditoriaComponent);
    expect(fixture.componentInstance.etiquetaDeAccion('crear')).toBe('Crear');
    expect(fixture.componentInstance.etiquetaDeAccion('cierre_caja')).toBe('Cierre de caja');
  });

  it('etiquetaDeAccion(): si la acción no está mapeada, la muestra tal cual', () => {
    const fixture = TestBed.createComponent(AuditoriaComponent);
    expect(fixture.componentInstance.etiquetaDeAccion('accion-rara')).toBe('accion-rara');
  });
});
