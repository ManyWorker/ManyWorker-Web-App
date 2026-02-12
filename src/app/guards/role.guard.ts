import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se espera que la ruta defina el rol requerido en data, ej:
  // { path: 'administrador', component: ..., canActivate: [roleGuard], data: { role: 'ADMINISTRADOR' } }
  const requiredRole = route.data?.['role'];

  if (!requiredRole) {
    console.warn('roleGuard: No se ha definido "role" en data de la ruta.');
    return true;
  }

  // Soporta string o array de strings
  const roles: string[] = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (roles.some(role => authService.hasRole(role))) {
    return true;
  }

  // Si no tiene el rol, redirigir a /403
  router.navigate(['/403']);
  return false;
};