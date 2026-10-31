import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { SesionService } from '../../core/services/sesion.service';
import { ConfiguracionService } from '../../core/services/configuracion.service';
import { ThemeService } from '../../core/services/theme.service';
import { guardarPreferencia, leerPreferencia } from '../../shared/utilidades/almacenamiento';
import { IconComponent, IconName } from '../../shared/componentes/icon/icon.component';

const CLAVE_COLAPSADO = 'it-sidebar-colapsado';

interface OpcionMenu {
  ruta: string;
  icono: IconName;
  etiqueta: string;
}

interface GrupoMenu {
  clave: string;
  etiqueta: string;
  opciones: OpcionMenu[];
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
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class ShellComponent {
  private authService = inject(AuthService);

  sesion = inject(SesionService);
  private configuracion = inject(ConfiguracionService);
  theme = inject(ThemeService);

  /** Menú reducido a iconos, para ganar ancho de pantalla. */
  readonly colapsado = signal(leerPreferencia(CLAVE_COLAPSADO) === '1');
  /** En móvil el menú es un cajón que se superpone. */
  readonly cajonAbierto = signal(false);

  /** Flujo diario de trabajo, disponible para todo el personal. */
  readonly menuOperacion: OpcionMenu[] = [
    { ruta: '/ordenes',    icono: 'clipboard-list', etiqueta: 'Órdenes' },
    { ruta: '/caja',       icono: 'wallet',         etiqueta: 'Caja' },
    { ruta: '/inventario', icono: 'package',        etiqueta: 'Inventario' },
  ];

  /** Ficha y catálogo comercial: cada opción conserva su permiso actual. */
  readonly menuComercial = computed(() => {
    const opciones: OpcionMenu[] = [];
    if (this.sesion.puedeGestionarOrdenes()) {
      opciones.push({ ruta: '/clientes', icono: 'users', etiqueta: 'Clientes' });
    }
    if (this.sesion.esAdmin()) {
      opciones.push({ ruta: '/productos', icono: 'tag', etiqueta: 'Productos' });
    }
    return opciones;
  });

  /** Caja financiera y seguimiento de saldos por cobrar. */
  readonly menuFinanzas = computed(() => {
    const opciones: OpcionMenu[] = [
      { ruta: '/finanzas', icono: 'landmark', etiqueta: 'Finanzas' },
    ];
    if (this.sesion.esSupervisor()) {
      opciones.push({ ruta: '/cuentas-por-cobrar', icono: 'coins', etiqueta: 'Cuentas por cobrar' });
    }
    return opciones;
  });

  /** Inteligencia de negocio se presenta como una sección propia. */
  readonly menuAnalitica = computed(() => this.sesion.esSupervisor()
    ? [{ ruta: '/bi', icono: 'bar-chart' as const, etiqueta: 'Inteligencia de negocio' },
       { ruta: '/ia', icono: 'clock' as const, etiqueta: 'Pronóstico de pedidos' }]
    : []
  );

  /** Configuración y control administrativo, solo para administración. */
  readonly menuAdministracion = computed(() => this.sesion.esAdmin()
    ? [
        { ruta: '/unidades', icono: 'ruler' as const, etiqueta: 'Unidades' },
        { ruta: '/usuarios', icono: 'key' as const, etiqueta: 'Usuarios' },
        { ruta: '/auditoria', icono: 'receipt-text' as const, etiqueta: 'Auditoría' },
      ]
    : []
  );

  /** Grupos vacíos se omiten para que el menú siga siendo claro por rol. */
  readonly gruposMenu = computed<GrupoMenu[]>(() => [
    { clave: 'operacion', etiqueta: 'Operación', opciones: this.menuOperacion },
    { clave: 'comercial', etiqueta: 'Comercial', opciones: this.menuComercial() },
    { clave: 'finanzas', etiqueta: 'Finanzas', opciones: this.menuFinanzas() },
    { clave: 'analitica', etiqueta: 'Analítica', opciones: this.menuAnalitica() },
    { clave: 'administracion', etiqueta: 'Administración', opciones: this.menuAdministracion() },
  ].filter(grupo => grupo.opciones.length > 0));

  constructor() {
    this.sesion.cargar();
    // Los parámetros y catálogos del negocio vienen del servidor (#54).
    this.configuracion.cargar();
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
    // Cierra la sesión en el servidor (revoca el token y borra la cookie).
    void this.authService.cerrarSesion();
  }
}
