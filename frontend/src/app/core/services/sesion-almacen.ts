/** Guarda y recupera la sesión (token JWT + perfil) en el navegador. */
import { UsuarioSistema } from '../models';
import { borrarPreferencia, guardarPreferencia, leerPreferencia } from '../../shared/utilidades/almacenamiento';

const CLAVE_TOKEN = 'it-token';
const CLAVE_USUARIO = 'it-usuario';

export function guardarSesion(token: string, usuario: UsuarioSistema): void {
  guardarPreferencia(CLAVE_TOKEN, token);
  guardarUsuario(usuario);
}

export function guardarUsuario(usuario: UsuarioSistema): void {
  guardarPreferencia(CLAVE_USUARIO, JSON.stringify(usuario));
}

export function leerToken(): string {
  return leerPreferencia(CLAVE_TOKEN);
}

export function leerUsuarioGuardado(): UsuarioSistema | null {
  const crudo = leerPreferencia(CLAVE_USUARIO);
  if (!crudo) return null;
  try {
    return JSON.parse(crudo) as UsuarioSistema;
  } catch {
    return null;
  }
}

export function limpiarSesion(): void {
  borrarPreferencia(CLAVE_TOKEN);
  borrarPreferencia(CLAVE_USUARIO);
}
