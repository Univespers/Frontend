import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { AuthService } from 'src/app/features/auth/auth.service';

export const visitanteAccessGuard: CanActivateChildFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isUserVisitante()) {
    // It's a student
    return true;
  } else {
    router.navigate([ "/redirect" ]);
    return false;
  }
}
