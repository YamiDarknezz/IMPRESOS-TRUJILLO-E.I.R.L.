import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SesionService } from '../services/sesion.service';

/**
 * Exige sesión iniciada.
 *
 * La comprobación es contra el servidor: el perfil lo devuelve `/api/auth/me`
 * y su cookie HttpOnly, así que no hay nada que el navegador pueda fabricar
 * (#48). Es solo la puerta de la interfaz: el permiso real lo aplica el
 * backend en cada petición.
 */
export const authGuard = async () => {
  const router = inject(Router);
  const sesion = inject(SesionService);

  await sesion.cargar();
  return sesion.usuario() ? true : router.createUrlTree(['/login']);
};
