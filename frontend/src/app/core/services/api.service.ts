import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { leerToken, limpiarSesion } from './sesion-almacen';

type MetodoHttp = 'get' | 'post' | 'patch' | 'delete';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private router = inject(Router);

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

  private cabeceras(): HttpHeaders {
    const token = leerToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  /**
   * Ejecuta la petición y, si el servidor responde 401 (token vencido o
   * revocado), cierra la sesión local y vuelve al login.
   */
  private async pedir<T>(metodo: MetodoHttp, path: string, body?: unknown): Promise<T> {
    const url = `${environment.apiUrl}${path}`;
    const opciones = { headers: this.cabeceras() };

    try {
      switch (metodo) {
        case 'get':
          return await firstValueFrom(this.http.get<T>(url, opciones));
        case 'post':
          return await firstValueFrom(this.http.post<T>(url, body ?? {}, opciones));
        case 'patch':
          return await firstValueFrom(this.http.patch<T>(url, body ?? {}, opciones));
        case 'delete':
          return await firstValueFrom(this.http.delete<T>(url, opciones));
      }
    } catch (error) {
      if ((error as { status?: number })?.status === 401) {
        limpiarSesion();
        this.router.navigate(['/login']);
      }
      throw error;
    }
  }
}
