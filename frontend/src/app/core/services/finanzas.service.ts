import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { CuentasPorCobrar, ETIQUETA_METODO, MetodoPago, RespuestaItem, ResumenFinanzas } from '../models';
import { hoyISO, primerDiaDelMesISO } from '../../shared/utilidades/fechas';
import { guardarPreferencia, leerPreferencia } from '../../shared/utilidades/almacenamiento';

const CLAVE_DESDE = 'it-fin-desde';
const CLAVE_HASTA = 'it-fin-hasta';

@Injectable({ providedIn: 'root' })
export class FinanzasService {
  private api = inject(ApiService);

  readonly resumen = signal<ResumenFinanzas | null>(null);
  readonly cargando = signal(false);

  /** Por defecto se muestra el mes en curso para reflejar la actividad del negocio. */
  readonly desde = signal(leerPreferencia(CLAVE_DESDE) || primerDiaDelMesISO());
  readonly hasta = signal(leerPreferencia(CLAVE_HASTA) || hoyISO());
  readonly trabajador = signal<number | null>(null);
  /** Vía de ingreso a la que se limita el reporte; vacío = todas (#69). */
  readonly canal = signal('');

  /** Desglose por método de pago, con etiquetas legibles. */
  readonly porMetodo = computed(() => {
    const metodos = this.resumen()?.por_metodo ?? {};
    return Object.keys(metodos).map(clave => ({
      metodo: ETIQUETA_METODO[clave as MetodoPago] ?? clave,
      monto: metodos[clave],
    }));
  });

  async cargar(): Promise<void> {
    guardarPreferencia(CLAVE_DESDE, this.desde());
    guardarPreferencia(CLAVE_HASTA, this.hasta());

    this.cargando.set(true);
    try {
      const res = await this.api.get<RespuestaItem<ResumenFinanzas>>(
        `/api/finanzas/resumen${this.consulta()}`
      );
      this.resumen.set(res.data);
    } finally {
      this.cargando.set(false);
    }
  }

  /** Deuda por cliente con su antigüedad (#72). Solo la ve la supervisión. */
  async cuentasPorCobrar(soloProformas = true): Promise<CuentasPorCobrar> {
    const res = await this.api.get<RespuestaItem<CuentasPorCobrar>>(
      `/api/finanzas/cuentas-por-cobrar?solo_proformas=${soloProformas}`
    );
    return res.data;
  }

  setMesActual(): void {
    this.desde.set(primerDiaDelMesISO());
    this.hasta.set(hoyISO());
    this.cargar();
  }

  setHoy(): void {
    this.desde.set(hoyISO());
    this.hasta.set(hoyISO());
    this.cargar();
  }

  setTodo(): void {
    this.desde.set('');
    this.hasta.set('');
    this.cargar();
  }

  private consulta(): string {
    const params = new URLSearchParams();
    if (this.desde()) params.set('desde', this.desde());
    if (this.hasta()) params.set('hasta', this.hasta());
    if (this.trabajador()) params.set('trabajador', String(this.trabajador()));
    if (this.canal()) params.set('canal_ingreso', this.canal());

    const texto = params.toString();
    return texto ? `?${texto}` : '';
  }
}
