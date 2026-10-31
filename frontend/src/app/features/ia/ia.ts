import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';

import { ApiService } from '../../core/services/api.service';
import { IconComponent } from '../../shared/componentes/icon/icon.component';
import { mensajeDeError } from '../../shared/utilidades/errores';

export interface PronosticoIA {
  corte: string;
  metodo: 'modelo' | 'media_7';
  supuesto_domingo_cerrado: boolean;
  valor_es_cobro: boolean;
  dias: Array<{ fecha: string; pedidos: number; valor_pedidos_pen: number }>;
}

export interface EstadoIA {
  disponible: boolean;
  evaluacion: {
    estado: 'sin_promocion' | 'candidato_aprobado';
    motivo: string;
    corte?: string;
    dias_abiertos?: number;
    ejecutado_en?: string;
    metricas_mae?: Record<string, { modelo: number; base: number }>;
  } | null;
  pronostico: PronosticoIA | null;
  aviso?: string;
}

@Component({
  selector: 'app-ia',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './ia.html',
  styleUrl: './ia.css',
})
export class IaComponent {
  private api = inject(ApiService);
  readonly datos = signal<EstadoIA | null>(null);
  readonly cargando = signal(false);
  readonly error = signal('');

  constructor() { void this.cargar(); }

  totalPedidos(pronostico: PronosticoIA): number {
    return pronostico.dias.reduce((total, dia) => total + dia.pedidos, 0);
  }

  totalValor(pronostico: PronosticoIA): number {
    return pronostico.dias.reduce((total, dia) => total + dia.valor_pedidos_pen, 0);
  }

  async cargar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      const respuesta = await this.api.get<{ data: EstadoIA }>('/api/ia/pronostico');
      this.datos.set(respuesta.data);
    } catch (error) {
      this.datos.set(null);
      this.error.set(mensajeDeError(error, 'No se pudo consultar el pronóstico. Vuelve a intentarlo.'));
    } finally {
      this.cargando.set(false);
    }
  }
}
