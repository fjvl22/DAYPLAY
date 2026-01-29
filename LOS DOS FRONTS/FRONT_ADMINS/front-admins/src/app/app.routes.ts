import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component')
        .then(m => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./home/home.component')
        .then(m => m.HomeComponent),
    children: [
      {
        path: 'pending',
        loadComponent: () =>
          import('./users-pending/users-pending.component')
            .then(m => m.UsersPendingComponent)
      },
      {
        path: 'chapter',
        loadComponent: () =>
          import('./users-chapter/users-chapter.component')
            .then(m => m.UsersChapterComponent)
      }
    ]
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./user/change-password/change-password.component')
        .then(m => m.ChangePasswordComponent)
  },
  {
    path: 'delete-account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./user/delete-account/delete-account.component')
        .then(m => m.DeleteAccountComponent)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
