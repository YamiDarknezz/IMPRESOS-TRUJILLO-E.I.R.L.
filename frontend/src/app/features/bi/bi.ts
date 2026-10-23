import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ApiService } from '../../core/services/api.service';
import { OrdenesService } from '../../core/services/ordenes.service';
import { Orden, ETIQUETA_ESTADO } from '../../core/models';
import { IndicadoresBI, ResumenBI } from '../../core/models/bi.model';
import { canalesIngreso, etiquetasCanal, etiquetasMetodo } from '../../core/estado/catalogos';
import { mensajeDeError } from '../../shared/utilidades/errores';
import { descargarCSV } from '../../shared/utilidades/csv';
import { ModalComponent } from '../../shared/componentes/modal/modal.component';

/** YYYY-MM-DD del calendario de Perú, independiente de la zona del navegador. */
export function fechaPeru(fecha = new Date()): string {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Lima' }).format(fecha);
}

function desplazar(dia: string, dias: number): string {
  const fecha = new Date(`${dia}T12:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() + dias);
  return fecha.toISOString().slice(0, 10);
}

@Component({
  selector: 'app-bi',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ModalComponent],
  templateUrl: './bi.html',
  styleUrl: './bi.css',
})
export class BiComponent {
  private api = inject(ApiService);
  private ordenes = inject(OrdenesService);
  private solicitud = 0;
  readonly datos = signal<ResumenBI | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');
  readonly hoy = fechaPeru();
  readonly desde = signal(desplazar(this.hoy, -6));
  readonly hasta = signal(this.hoy);
  readonly unidad = signal('');
  readonly canal = signal('');
  readonly canales = computed(() => canalesIngreso());
  readonly etiquetaCanal = computed(() => etiquetasCanal());
  readonly etiquetaMetodo = computed(() => etiquetasMetodo());
  readonly etiquetaEstado = ETIQUETA_ESTADO as Record<string, string>;
  readonly historial = signal<Orden | null>(null);
  readonly cargandoHistorial = signal(false);
  readonly errorHistorial = signal('');
  private solicitudHistorial = 0;
  readonly vistaPendientes = signal<'para_entregar' | 'para_cobrar' | 'vencidas'>('para_entregar');
  readonly pendientes = computed(() => this.datos()?.operacion[this.vistaPendientes()] ?? []);
  readonly maximoSerie = computed(() => Math.max(1,
    ...this.datos()?.serie_diaria.flatMap(d => [d.ventas, d.cobros]) ?? []));
  readonly yapeTotal = computed(() => (this.datos()?.cobros_por_metodo ?? [])
    .filter(m => m.metodo.startsWith('yape')).reduce((s, m) => s + m.monto, 0));

  constructor() { void this.cargar(); }

  async cargar(): Promise<void> {
    const solicitud = ++this.solicitud;
    if (!this.desde() || !this.hasta() || this.desde() > this.hasta() || this.hasta() > this.hoy) {
      this.error.set('Selecciona un rango válido, con fecha final no posterior a hoy en Perú.');
      this.datos.set(null);
      this.cargando.set(false);
      return;
    }
    this.error.set('');
    this.cargando.set(true);
    // No mostrar resultados de filtros anteriores mientras se recalcula.
    this.datos.set(null);
    const params = new URLSearchParams({ desde: this.desde(), hasta: this.hasta() });
    if (this.unidad()) params.set('unidad_negocio', this.unidad());
    if (this.canal()) params.set('canal_ingreso', this.canal());
    try {
      const respuesta = await this.api.get<{ data: ResumenBI }>(`/api/bi/resumen?${params}`);
      if (solicitud === this.solicitud) this.datos.set(respuesta.data);
    } catch (error) {
      if (solicitud === this.solicitud) this.error.set(mensajeDeError(error, 'No se pudo cargar el BI. Vuelve a intentarlo.'));
    } finally {
      if (solicitud === this.solicitud) this.cargando.set(false);
    }
  }

  periodo(tipo: 'semana' | 'mes' | 'anterior'): void {
    const fin = tipo === 'anterior' ? desplazar(this.hoy, -1) : this.hoy;
    this.hasta.set(fin);
    this.desde.set(tipo === 'mes' ? `${fin.slice(0, 7)}-01` : desplazar(fin, -6));
    void this.cargar();
  }

  variacion(campo: keyof IndicadoresBI): string {
    const datos = this.datos();
    if (!datos?.comparacion.disponible) return 'Sin comparación equivalente';
    const previo = datos.comparacion.indicadores[campo];
    const actual = datos.indicadores[campo];
    if (previo === null || actual === null || previo === 0) return 'Sin base de comparación';
    const cambio = (actual - previo) / previo * 100;
    return `${cambio > 0 ? '+' : ''}${cambio.toFixed(1)}% vs. período anterior`;
  }

  nombreLinea(clave: string): string {
    return clave === 'imprenta' ? 'Imprenta' : clave === 'gigantografias' ? 'Gigantografías' : clave;
  }

  async verPagos(id: number): Promise<void> {
    const solicitud = ++this.solicitudHistorial;
    this.historial.set(null);
    this.errorHistorial.set('');
    this.cargandoHistorial.set(true);
    try {
      const orden = await this.ordenes.obtener(id);
      if (solicitud === this.solicitudHistorial) this.historial.set(orden);
    } catch (error) {
      if (solicitud === this.solicitudHistorial) this.errorHistorial.set(mensajeDeError(error, 'No se pudo consultar el historial.'));
    } finally {
      if (solicitud === this.solicitudHistorial) this.cargandoHistorial.set(false);
    }
  }

  cerrarHistorial(): void {
    ++this.solicitudHistorial;
    this.historial.set(null);
    this.cargandoHistorial.set(false);
    this.errorHistorial.set('');
  }

  exportar(): void {
    const d = this.datos();
    if (!d) return;
    descargarCSV(`bi_${d.periodo.desde}_${d.periodo.hasta}.csv`, [
      ['Inteligencia de negocio v1 — Impresos Trujillo'],
      ['Período Perú', d.periodo.desde, d.periodo.hasta],
      ['Línea', this.unidad() || 'Todas'], ['Canal', this.canal() || 'Todos'],
      ['Generado en UTC', d.generado_en],
      ['Nota', 'Órdenes no canceladas. Cobros conformes por fecha de pago. No es utilidad.'],
      ['Valor de órdenes', d.indicadores.valor_ordenes], ['Cobros', d.indicadores.cobros],
      ['Órdenes', d.indicadores.ordenes], ['Ticket promedio', d.indicadores.ticket_promedio],
      ['Liquidadas hoy, cohorte del período', d.indicadores.liquidadas],
      ['Saldo actual sin filtro de fechas', d.cobranza.saldo_actual], [],
      ['Día Perú', 'Valor de órdenes', 'Cobros conformes'],
      ...d.serie_diaria.map(f => [f.fecha, f.ventas, f.cobros]), [],
      ['Clientes con deuda actual (10 mayores)', 'Órdenes', 'Saldo'],
      ...d.cobranza.clientes.map(c => [c.nombre, c.ordenes, c.saldo]), [],
      ['Pagos conformes de canceladas excluidos, período', d.calidad.pagos_en_canceladas],
      ['Órdenes con diferencia entre total, saldo y pagos, al corte', d.calidad.ordenes_descuadradas],
    ]);
  }
}
