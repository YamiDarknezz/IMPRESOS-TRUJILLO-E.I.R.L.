import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolesGuard } from './core/guards/roles.guard';

/**
 * Rutas de la aplicación.
 *
 * Todas las pantallas cuelgan del armazón (barra superior + menú lateral), que
 * es lo único que se mantiene montado al navegar. Se cargan bajo demanda con
 * `loadComponent`: al entrar solo se descarga el código de la pantalla que se
 * está abriendo.
 *
 * Los guardas de rol solo ordenan la interfaz; el backend valida cada permiso.
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'ordenes',
        loadComponent: () => import('./features/ordenes/ordenes').then(m => m.OrdenesComponent),
      },
      {
        path: 'ordenes/nueva',
        canActivate: [rolesGuard('admin', 'subgerente', 'secretaria')],
        loadComponent: () => import('./features/ordenes/orden-form').then(m => m.OrdenFormComponent),
      },
      {
        path: 'ordenes/:id/editar',
        canActivate: [rolesGuard('admin', 'subgerente', 'secretaria')],
        loadComponent: () => import('./features/ordenes/orden-form').then(m => m.OrdenFormComponent),
      },
      {
        path: 'inventario',
        loadComponent: () => import('./features/inventario/inventario').then(m => m.InventarioComponent),
      },
      {
        path: 'caja',
        loadComponent: () => import('./features/caja/caja').then(m => m.CajaComponent),
      },
      {
        path: 'finanzas',
        loadComponent: () => import('./features/finanzas/finanzas').then(m => m.FinanzasComponent),
      },
      {
        path: 'clientes',
        canActivate: [rolesGuard('admin', 'subgerente', 'secretaria')],
        loadComponent: () => import('./features/clientes/clientes').then(m => m.ClientesComponent),
      },
      {
        path: 'productos',
        canActivate: [rolesGuard('admin')],
        loadComponent: () => import('./features/productos/productos').then(m => m.ProductosComponent),
      },
      {
        path: 'unidades',
        canActivate: [rolesGuard('admin')],
        loadComponent: () => import('./features/unidades/unidades').then(m => m.UnidadesComponent),
      },
      {
        path: 'usuarios',
        canActivate: [rolesGuard('admin')],
        loadComponent: () => import('./features/usuarios/usuarios').then(m => m.UsuariosComponent),
      },
      {
        path: 'auditoria',
        canActivate: [rolesGuard('admin')],
        loadComponent: () => import('./features/auditoria/auditoria').then(m => m.AuditoriaComponent),
      },
      { path: '', redirectTo: 'ordenes', pathMatch: 'full' },
    ],
  },
  // Cualquier ruta desconocida vuelve al inicio en vez de dejar la pantalla en blanco.
  { path: '**', redirectTo: '' },
];
