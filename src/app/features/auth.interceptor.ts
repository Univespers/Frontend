import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../features/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authToken = inject(AuthService).auth.token;
  if(authToken) {
    const newReq = request.clone({
      headers: request.headers.append('X-Authentication-Token', authToken),
    });
    return next(newReq);
  }
  return next(request);
}
