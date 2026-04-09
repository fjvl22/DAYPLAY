import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

import { LayoutComponent } from './layout/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { PendingUsersComponent } from './pages/pending-users/pending-users.component';
import { GamesComponent } from './pages/games/games.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { PaymentDetailComponent } from './pages/payment-detail/payment-detail.component';
import { DailyRewardsComponent } from './pages/daily-rewards/daily-rewards.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { EventsComponent } from './pages/events/events.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { DeleteAccountComponent } from './pages/delete-account/delete-account.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [roleGuard],
    canActivateChild: [roleGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'pending-users', component: PendingUsersComponent },
      { path: 'games', component: GamesComponent },
      { path: 'payments', component: PaymentsComponent },
      { path: 'payments/:id', component: PaymentDetailComponent },
      { path: 'daily-rewards', component: DailyRewardsComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'events', component: EventsComponent, data: { roles: ['SUPER_ADMIN', 'ADMIN'] } },
      { path: 'change-password', component: ChangePasswordComponent },
      { path: 'delete-account', component: DeleteAccountComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];