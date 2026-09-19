import { Injectable, computed, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { ETIQUETA_METODO, MetodoPago, RespuestaItem, ResumenFinanzas } from '../models';
import { hoyISO } from '../../shared/utilidades/fechas';
import { guardarPreferencia, leerPreferencia } from '../../shared/utilidades/almacenamiento';

const CLAVE_DESDE = 'it-fin-desde';
const CLAVE_HASTA = 'it-fin-hasta';

@Injectable({ providedIn: 'root' })
export class FinanzasService {
  private api = inject(ApiService);

  readonly resumen = signal<ResumenFinanzas | null>(null);
  readonly cargando = signal(false);

  /** El último rango consultado se recuerda entre sesiones. */
  readonly desde = signal(leerPreferencia(CLAVE_DESDE) || hoyISO());
  readonly hasta = signal(leerPreferencia(CLAVE_HASTA) || hoyISO());
  readonly trabajador = signal<number | null>(null);

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

  private consulta(): string {
    const params = new URLSearchParams();
    if (this.desde()) params.set('desde', this.desde());
    if (this.hasta()) params.set('hasta', this.hasta());
    if (this.trabajador()) params.set('trabajador', String(this.trabajador()));

    const texto = params.toString();
    return texto ? `?${texto}` : '';
  }
}
