import {
  reiniciarConfiguracion,
  adelantoMinimoPorcentaje,
  empresa,
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

  // Issue #68: los datos de la empresa para el contrato impreso vienen del servidor.
  it('hidratarConfiguracion() guarda los datos de la empresa y reiniciar los vacía', () => {
    const datos = { razon_social: 'Impresos Trujillo E.I.R.L.', ruc: '20602572952', direccion: 'Jr. Simón Bolívar', telefono: '924', horario: '10 a 8' };

    hidratarConfiguracion({ parametros: PARAMETROS_DE_PRUEBA, catalogos: CATALOGOS_DE_PRUEBA, empresa: datos });
    expect(empresa()).toEqual(datos);

    reiniciarConfiguracion();
    expect(empresa().ruc).toBe('');
  });

  it('si el servidor aún no manda la empresa, queda el nombre de fábrica sin inventar datos', () => {
    hidratarConfiguracion({ parametros: PARAMETROS_DE_PRUEBA, catalogos: CATALOGOS_DE_PRUEBA });
    expect(empresa().razon_social).toBe('Impresos Trujillo');
    expect(empresa().ruc).toBe('');
  });
});
