import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Buscamos qué rol pide la ruta (lo configuraremos luego en app.routes)
  const expectedRole = route.data['expectedRole'];
  
  // 2. Buscamos qué rol tiene el usuario (guardado en localStorage)
  const currentRole = localStorage.getItem('rol');

  // 3. Comparamos
  if (currentRole === expectedRole) {
    return true;
  } else {
    alert('No tienes permisos para acceder aquí.');
    router.navigate(['/']); // Lo mandamos al inicio
    return false;
  }
};