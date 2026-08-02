/**
 * @file app.routes.ts
 * @description All application route definitions.
 *
 * Route change: Dashboard is now loaded directly at '/' (root path).
 * The old '/dashboard' URL still works as a backward-compat redirect.
 * This makes the home URL cleaner and removes the unnecessary redirect hop.
 */

import { Routes } from '@angular/router';
import { PageContainerComponent } from './layout/page-container/page-container.component';

export const routes: Routes = [
  {
    path: '',
    component: PageContainerComponent,
    children: [
      // Root path '/' → Dashboard directly (no redirect hop)
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        pathMatch: 'full',
      },

      // Keep '/dashboard' working for anyone with bookmarks or old links
      {
        path: 'dashboard',
        redirectTo: '',
        pathMatch: 'full',
      },

      {
        path: 'expenses',
        loadComponent: () =>
          import('./features/expenses/expenses.component').then((m) => m.ExpensesComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then((m) => m.ReportsComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },

  // Catch-all: unknown URLs go back to home (dashboard)
  { path: '**', redirectTo: '' },
];
