import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from 'src/app/utils/auth.service';

export const routeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  switch (true) {
    case auth.isUserGuest():
      router.navigate([ "/login" ]);
      return true;

    case auth.isUserStudent():
      router.navigate([ "/colegas" ]);
      return true;

    default:
      return false;
  }

};
