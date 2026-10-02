import {
  reiniciarConfiguracion,
  adelantoMinimoPorcentaje,
  etiquetaDe,
  etiquetaMovimiento,
  etiquetasDe,
  hidratarConfiguracion,
  igvPorcentaje,
  metodosPago,
  motivosObservacion,
  valoresDe,
} from './catalogos';
import { CATALOGOS_DE_PRUEBA, PARAMETROS_DE_PRUEBA } from './catalogos.prueba';

describe('estado de catálogos (#54)', () => {
  beforeEach(() => {
    reiniciarConfiguracion();
    hidratarConfiguracion({
      parametros: PARAMETROS_DE_PRUEBA,
      catalogos: CATALOGOS_DE_PRUEBA,
    });
  });

  it('los porcentajes del negocio salen del servidor', () => {
    expect(igvPorcentaje()).toBe(18);
    expect(adelantoMinimoPorcentaje()).toBe(50);

    // Cambiar el parámetro en el servidor cambia la pantalla: era justo lo que
    // no pasaba cuando el 18 % estaba escrito a mano.
    hidratarConfiguracion({
      parametros: { igv_porcentaje: 10, adelanto_minimo_porcentaje: 30 },
      catalogos: CATALOGOS_DE_PRUEBA,
    });
    expect(igvPorcentaje()).toBe(10);
    expect(adelantoMinimoPorcentaje()).toBe(30);
  });

  it('las listas y sus etiquetas vienen del catálogo', () => {
    expect(metodosPago()).toEqual(['efectivo', 'yape', 'transferencia']);
    expect(valoresDe('acciones_auditoria')).toContain('observacion_pago');
    expect(etiquetasDe('metodos_pago')['yape']).toBe('Yape');
    expect(motivosObservacion().map(m => m.valor)).toContain('yape_falso');
  });

  it('un valor sin etiqueta se muestra legible, no crudo', () => {
    // Esto era el fallo: en /auditoria salía "observacion_pago" tal cual.
    expect(etiquetaDe('acciones_auditoria', 'valor_desconocido')).toBe('valor desconocido');
  });

  it('los motivos de movimiento se traducen', () => {
    expect(etiquetaMovimiento('reserva')).toBe('Reserva por orden');
    expect(etiquetaMovimiento('ajuste_manual')).toBe('Ajuste manual');
  });
});
