import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthService } from './auth.service';

// Impede carregamento da página até que Auth seja definido. Isso impede que um usuário logado consiga ver Login
export const authResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(AuthService);
  return authService.loginManager();
};
