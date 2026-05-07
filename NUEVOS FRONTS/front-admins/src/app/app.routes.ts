import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './components/layout/layout.component';

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
    path: 'layout',
    component: LayoutComponent,
    children: [
      {
        path: 'users',
        loadComponent: () => import('./pages/users/users.page').then(m => m.UsersPage)
      },
      {
        path: 'pending-users',
        loadComponent: () => import('./pages/pending-users/pending-users.page').then(m => m.PendingUsersPage)
      },
      {
        path: 'payments',
        loadComponent: () => import('./pages/payments/payments.page').then(m => m.PaymentsPage)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.page').then(m => m.NotificationsPage)
      },
      {
        path: 'games',
        loadComponent: () => import('./pages/games/games.page').then(m => m.GamesPage)
      },
      {
        path: 'events',
        loadComponent: () => import('./pages/events/events.page').then(m => m.EventsPage)
      },
      {
        path: 'daily-rewards',
        loadComponent: () => import('./pages/daily-rewards/daily-rewards.page').then(m => m.DailyRewardsPage)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];