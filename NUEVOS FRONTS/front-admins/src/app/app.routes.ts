import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'users',
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./pages/users/users.page').then(m => m.UsersPage)
  },
  {
    path: 'pending-users',
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./pages/pending-users/pending-users.page').then(m => m.PendingUsersPage)
  },
  {
    path: 'games',
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./pages/games/games.page').then(m => m.GamesPage)
  },
  {
    path: 'payments',
    canActivate: [roleGuard],
    loadComponent: () =>
      import('./pages/payments/payments.page').then(m => m.PaymentsPage)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];