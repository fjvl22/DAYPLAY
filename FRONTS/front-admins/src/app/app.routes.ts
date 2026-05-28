import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
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
    path: 'layout',
    component: LayoutComponent,
    canActivate: [roleGuard],
    children: [
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { departments: ['GAME'] },
        loadComponent: () =>
          import('./pages/users/users.page').then(m => m.UsersPage)
      },
      {
        path: 'pending-users',
        canActivate: [roleGuard],
        data: { departments: ['GAME'] },
        loadComponent: () =>
          import('./pages/pending-users/pending-users.page').then(m => m.PendingUsersPage)
      },
      {
        path: 'daily-game-rewards',
        canActivate: [roleGuard],
        data: { departments: ['GAME'] },
        loadComponent: () =>
          import('./pages/daily-rewards/daily-rewards.page').then(m => m.DailyRewardsPage)
      },
      {
        path: 'games',
        canActivate: [roleGuard],
        data: { departments: ['GAME'] },
        loadComponent: () =>
          import('./pages/games/games.page').then(m => m.GamesPage)
      },
      {
        path: 'payments',
        canActivate: [roleGuard],
        data: { departments: ['PAYMENT'] },
        loadComponent: () =>
          import('./pages/payments/payments.page').then(m => m.PaymentsPage)
      },
      {
        path: 'notifications',
        canActivate: [roleGuard],
        data: { departments: ['NOTIF'] },
        loadComponent: () =>
          import('./pages/notifications/notifications.page').then(m => m.NotificationsPage)
      },
      {
        path: 'events',
        canActivate: [roleGuard],
        data: { departments: ['EVENT'] },
        loadComponent: () =>
          import('./pages/events/events.page').then(m => m.EventsPage)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];