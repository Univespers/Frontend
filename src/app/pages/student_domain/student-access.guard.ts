import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

import { AuthService } from 'src/app/utils/auth.service';

export const studentAccessGuard: CanActivateChildFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isUserStudent()) {
    // It's a student
    return true;
  } else {
    router.navigate([ "/redirect" ]);
    return false;
  }
}
