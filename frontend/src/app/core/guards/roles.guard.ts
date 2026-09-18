import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Rol } from '../models';
import { leerUsuarioGuardado } from '../services/sesion-almacen';

/**
 * Exige uno de los roles indicados para entrar a una pantalla.
 *
 * Oculta pantallas que el usuario no puede usar; el backend rechaza igual
 * cualquier operación no permitida.
 */
export function rolesGuard(...permitidos: Rol[]) {
  return () => {
    const router = inject(Router);
    const usuario = leerUsuarioGuardado();
    if (usuario && permitidos.includes(usuario.rol)) return true;
    return router.createUrlTree(['/ordenes']);
  };
}
