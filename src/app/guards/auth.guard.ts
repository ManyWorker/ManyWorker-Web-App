import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    // Si tiene token, le dejamos pasar
    return true;
  } else {
    // Si no, lo mandamos al login
    router.navigate(['/login']);
    return false;
  }
};