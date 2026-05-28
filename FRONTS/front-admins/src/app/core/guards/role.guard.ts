import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { filter, map, take } from "rxjs/operators";

export const roleGuard: CanActivateFn = (route) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const departments = route.data?.['departments'] as string[] | undefined;

  if (!auth.isLogged()) return router.parseUrl('/login');

  return auth.department$.pipe(

    filter((dep): dep is string => dep !== null && dep !== ''),

    take(1),

    map(dep => {

      if (departments && !departments.includes(dep)) return router.parseUrl('/login');

      return true;
    })
  );
};