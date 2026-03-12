import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLogged()) {
    return router.parseUrl('/login');
  }

  const roles = route.data?.['roles'];
  const userRole = auth.getAdminType();

  if (roles && !roles.includes(userRole)) {
    return router.parseUrl('/');
  }

  return true;
};