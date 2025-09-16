import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from 'src/app/features/auth/auth.service';

export const routeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  switch(true) {
    case auth.isUserVisitante():
      router.navigate([ "/login" ]);
      return true;

    case auth.isUserEstudante():
      router.navigate([ "/colegas" ]);
      return true;

    default:
      return false;
  }

};
