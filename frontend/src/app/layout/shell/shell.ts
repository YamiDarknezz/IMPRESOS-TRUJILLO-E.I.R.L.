import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { SesionService } from '../../core/services/sesion.service';
import { ThemeService } from '../../core/services/theme.service';
import { guardarPreferencia, leerPreferencia } from '../../shared/utilidades/almacenamiento';

const CLAVE_COLAPSADO = 'it-sidebar-colapsado';

interface OpcionMenu {
  ruta: string;
  icono: string;
  etiqueta: string;
}

/**
 * Armazón de la aplicación: barra superior, menú lateral y el hueco donde se
 * dibuja cada pantalla.
 *
 * Es el único componente que se mantiene montado al navegar, así que aquí se
 * carga la sesión una sola vez para todas las pantallas.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class ShellComponent {
  private authService = inject(AuthService);

  sesion = inject(SesionService);
  theme = inject(ThemeService);

  /** Menú reducido a iconos, para ganar ancho de pantalla. */
  readonly colapsado = signal(leerPreferencia(CLAVE_COLAPSADO) === '1');
  /** En móvil el menú es un cajón que se superpone. */
  readonly cajonAbierto = signal(false);

  /** Pantallas de operación: las ve todo el personal. */
  readonly menuOperacion: OpcionMenu[] = [
    { ruta: '/ordenes',    icono: '📋', etiqueta: 'Órdenes' },
    { ruta: '/inventario', icono: '📦', etiqueta: 'Inventario' },
    { ruta: '/caja',       icono: '💵', etiqueta: 'Caja' },
    { ruta: '/finanzas',   icono: '📊', etiqueta: 'Finanzas' },
  ];

  /** Administración: cada opción aparece según el rol (el backend manda). */
  get menuAdministracion(): OpcionMenu[] {
    const opciones: OpcionMenu[] = [];

    if (this.sesion.puedeGestionarOrdenes()) {
      opciones.push({ ruta: '/clientes', icono: '👥', etiqueta: 'Clientes' });
    }
    if (this.sesion.esSupervisor()) {
      opciones.push({ ruta: '/productos', icono: '🏷️', etiqueta: 'Productos' });
    }
    if (this.sesion.esAdmin()) {
      opciones.push({ ruta: '/unidades', icono: '📏', etiqueta: 'Unidades' });
      opciones.push({ ruta: '/usuarios', icono: '🔑', etiqueta: 'Usuarios' });
      opciones.push({ ruta: '/auditoria', icono: '🧾', etiqueta: 'Auditoría' });
    }
    return opciones;
  }

  constructor() {
    this.sesion.cargar();
  }

  alternarColapsado(): void {
    this.colapsado.update(valor => !valor);
    guardarPreferencia(CLAVE_COLAPSADO, this.colapsado() ? '1' : '0');
  }

  /** Al elegir una opción en móvil, el cajón debe cerrarse solo. */
  cerrarCajon(): void {
    this.cajonAbierto.set(false);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
