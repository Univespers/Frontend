import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { AuthService } from 'src/app/entities/auth/auth.service';

export const guestAccessGuard: CanActivateChildFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isUserGuest()) {
    // It's a student
    return true;
  } else {
    router.navigate([ "/redirect" ]);
    return false;
  }
}