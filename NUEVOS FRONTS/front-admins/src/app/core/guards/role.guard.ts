import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const roleGuard: CanActivateFn = (route, state): boolean => {

  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLogged()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = route.data?.['roles'];
  const userRole = auth.getAdminType();

  if (roles && userRole && !roles.includes(userRole)) {
    router.navigate(['/users']);
    return false;
  }

  return true;
};