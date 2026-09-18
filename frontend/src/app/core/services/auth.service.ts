import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { SesionService } from './sesion.service';
import { guardarSesion, limpiarSesion } from './sesion-almacen';
import { RespuestaItem, SesionIniciada } from '../models';

/** Inicio y cierre de sesión contra el backend (JWT). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private sesion = inject(SesionService);

  async login(email: string, password: string): Promise<void> {
    const res = await this.api.post<RespuestaItem<SesionIniciada>>('/api/auth/login', {
      email,
      password,
    });
    guardarSesion(res.data.access_token, res.data.usuario);
    // El shell vuelve a cargar el perfil con el token nuevo.
    this.sesion.reiniciar();
  }

  cerrarSesion(): void {
    limpiarSesion();
    this.sesion.reiniciar();
    this.router.navigate(['/login']);
  }
}
