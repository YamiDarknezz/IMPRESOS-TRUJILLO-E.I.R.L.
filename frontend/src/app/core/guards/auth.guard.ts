import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { leerToken } from '../services/sesion-almacen';

/**
 * Exige sesión iniciada.
 *
 * Es solo la puerta de la interfaz: el permiso real lo aplica el backend en
 * cada petición.
 */
export const authGuard = () => {
  const router = inject(Router);
  if (leerToken()) return true;
  return router.createUrlTree(['/login']);
};
