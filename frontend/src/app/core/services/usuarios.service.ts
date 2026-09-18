import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { RespuestaItem, RespuestaLista, Rol, UsuarioSistema } from '../models';

export interface DatosUsuario {
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

/** Gestión de cuentas del sistema (solo administrador). */
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private api = inject(ApiService);

  async listar(): Promise<UsuarioSistema[]> {
    const res = await this.api.get<RespuestaLista<UsuarioSistema>>('/api/usuarios');
    return res.data ?? [];
  }

  async crear(datos: DatosUsuario): Promise<UsuarioSistema> {
    const res = await this.api.post<RespuestaItem<UsuarioSistema>>('/api/usuarios', datos);
    return res.data;
  }

  async actualizar(
    id: number,
    datos: { nombre?: string; rol?: Rol; activo?: boolean },
  ): Promise<UsuarioSistema> {
    const res = await this.api.patch<RespuestaItem<UsuarioSistema>>(
      `/api/usuarios/${id}`,
      datos
    );
    return res.data;
  }

  async cambiarPassword(
    passwordActual: string,
    passwordNueva: string,
  ): Promise<string> {
    const res = await this.api.post<RespuestaItem<{ access_token: string }>>(
      '/api/auth/password',
      { password_actual: passwordActual, password_nueva: passwordNueva }
    );
    return res.data.access_token;
  }
}
