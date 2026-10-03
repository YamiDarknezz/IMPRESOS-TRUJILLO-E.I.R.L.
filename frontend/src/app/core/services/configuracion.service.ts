import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { RespuestaItem } from '../models';
import {
  Catalogos,
  DatosEmpresa,
  ParametrosNegocio,
  configuracionLista,
  hidratarConfiguracion,
} from '../estado/catalogos';

interface RespuestaConfiguracion {
  parametros: ParametrosNegocio;
  catalogos: Catalogos;
  empresa?: DatosEmpresa;
}

/**
 * Pide al servidor los parámetros y catálogos del negocio (#54).
 *
 * Se llama una vez al iniciar la sesión: los porcentajes (IGV, adelanto mínimo)
 * y las listas de valores dejan de estar escritos a mano en la pantalla, así que
 * cambiar `IGV_PORCENTAJE` en el `.env` ya no deja la interfaz desincronizada.
 */
@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private api = inject(ApiService);
  private enVuelo: Promise<void> | null = null;

  /** Una sola llamada: si ya está cargada, no repite la petición. */
  async cargar(forzar = false): Promise<void> {
    if (configuracionLista() && !forzar) return;
    if (this.enVuelo) return this.enVuelo;

    this.enVuelo = (async () => {
      try {
        const res = await this.api.get<RespuestaItem<RespuestaConfiguracion>>('/api/configuracion');
        hidratarConfiguracion(res.data);
      } catch {
        // Sin respuesta se sigue con los valores de fábrica: es preferible a
        // dejar la pantalla sin IGV o sin métodos de pago.
      } finally {
        this.enVuelo = null;
      }
    })();

    return this.enVuelo;
  }
}
