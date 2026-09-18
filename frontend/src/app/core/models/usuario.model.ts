export type Rol = 'admin' | 'subgerente' | 'secretaria' | 'disenadora' | 'operario';

export const ROLES: Rol[] = ['admin', 'subgerente', 'secretaria', 'disenadora', 'operario'];

export const ETIQUETA_ROL: Record<Rol, string> = {
  admin: 'Administrador',
  subgerente: 'Subgerente',
  secretaria: 'Secretaría',
  disenadora: 'Diseñadora',
  operario: 'Operario',
};

export interface UsuarioSistema {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
  activo: boolean;
}

/** Respuesta del login: token JWT y perfil del usuario. */
export interface SesionIniciada {
  access_token: string;
  token_type: string;
  usuario: UsuarioSistema;
}
