import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Rol } from '../models';
import { SesionService } from '../services/sesion.service';

/**
 * Exige uno de los roles indicados para entrar a una pantalla.
 *
 * El rol se toma del perfil que devuelve el servidor, nunca de algo guardado
 * en el navegador: antes bastaba con escribir el rol a mano en el localStorage
 * para abrir estas pantallas (#48). Oculta pantallas que el usuario no puede
 * usar; el backend rechaza igual cualquier operación no permitida.
 */
export function rolesGuard(...permitidos: Rol[]) {
  return async () => {
    const router = inject(Router);
    const sesion = inject(SesionService);

    await sesion.cargar();
    const usuario = sesion.usuario();
    if (usuario && permitidos.includes(usuario.rol)) return true;

    return router.createUrlTree(['/ordenes']);
  };
}
