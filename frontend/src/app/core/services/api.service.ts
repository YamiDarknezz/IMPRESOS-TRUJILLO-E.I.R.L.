import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

type MetodoHttp = 'get' | 'post' | 'patch' | 'delete';

/**
 * Cliente HTTP de la aplicación.
 *
 * La sesión viaja en una cookie HttpOnly que el backend pone al iniciar sesión
 * (#48): ningún script la lee ni la manda, así que aquí no hay token que
 * adjuntar. El navegador la envía sola por ser el mismo origen.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private manejadoresExpiracion: Array<() => void> = [];

  /** Aviso para cuando el servidor rechace la sesión (401). */
  alExpirarSesion(fn: () => void): void {
    this.manejadoresExpiracion.push(fn);
  }

  get<T>(path: string): Promise<T> {
    return this.pedir<T>('get', path);
  }

  post<T>(path: string, body: unknown = {}): Promise<T> {
    return this.pedir<T>('post', path, body);
  }

  patch<T>(path: string, body: unknown = {}): Promise<T> {
    return this.pedir<T>('patch', path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.pedir<T>('delete', path);
  }

  /**
   * Sube un formulario con archivos.
   *
   * El Content-Type lo pone el navegador con su propio límite (`boundary`);
   * fijarlo a mano rompe el envío.
   */
  subir<T>(path: string, formulario: FormData): Promise<T> {
    return this.pedir<T>('post', path, formulario);
  }

  /**
   * Ejecuta la petición y, si el servidor responde 401 (sesión vencida o
   * revocada), avisa a quien lleve el perfil y vuelve al login.
   */
  private async pedir<T>(metodo: MetodoHttp, path: string, body?: unknown): Promise<T> {
    const url = `${environment.apiUrl}${path}`;

    try {
      switch (metodo) {
        case 'get':
          return await firstValueFrom(this.http.get<T>(url, { withCredentials: true }));
        case 'post':
          return await firstValueFrom(this.http.post<T>(url, body ?? {}, { withCredentials: true }));
        case 'patch':
          return await firstValueFrom(this.http.patch<T>(url, body ?? {}, { withCredentials: true }));
        case 'delete':
          return await firstValueFrom(this.http.delete<T>(url, { withCredentials: true }));
      }
    } catch (error) {
      // El 401 del propio login son credenciales incorrectas, no una sesión
      // que se cayó: no hay nada que limpiar ni a dónde redirigir.
      const esLogin = path.startsWith('/api/auth/login');
      if ((error as { status?: number })?.status === 401 && !esLogin) {
        this.manejadoresExpiracion.forEach(aviso => aviso());
        this.router.navigate(['/login']);
      }
      throw error;
    }
  }
}
