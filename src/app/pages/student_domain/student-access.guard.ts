import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from 'src/app/utils/auth.service';

export const studentAccessGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isUserStudent()) {
    // It's a student
    return true;
  } else {
    // It's a guest
    router.navigate(['/login']);
    return false;
  }
};
