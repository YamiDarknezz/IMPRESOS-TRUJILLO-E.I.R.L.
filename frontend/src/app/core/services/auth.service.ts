import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';
import { SesionService } from './sesion.service';
import { RespuestaItem, SesionIniciada } from '../models';

/**
 * Inicio y cierre de sesión.
 *
 * El backend deja el token en una cookie HttpOnly (#48), así que aquí no se
 * guarda nada: solo se pide el perfil para que la interfaz sepa quién entró.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private sesion = inject(SesionService);

  async login(email: string, password: string): Promise<void> {
    await this.api.post<RespuestaItem<SesionIniciada>>('/api/auth/login', {
      email,
      password,
    });

    this.sesion.reiniciar();
    await this.sesion.cargar();
  }

  /**
   * Cierra la sesión en el servidor: revoca el token y borra la cookie. Es
   * obligatorio pasar por aquí, porque el navegador no puede borrar una cookie
   * HttpOnly por su cuenta.
   */
  async cerrarSesion(): Promise<void> {
    try {
      await this.api.post('/api/auth/logout');
    } catch {
      // Aunque el servidor no responda, la interfaz no puede quedarse abierta.
    }
    this.sesion.reiniciar();
    this.router.navigate(['/login']);
  }
}
