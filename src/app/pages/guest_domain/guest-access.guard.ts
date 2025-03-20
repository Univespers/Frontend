import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../auth.service';

export const guestAccessGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isUserGuest()) {
    // It's a guest
    return true;
  } else {
    // It's a student
    router.navigate(['/colleagues']);
    return false;
  }
};
