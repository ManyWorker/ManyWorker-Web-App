import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Añade esto
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor'; // Añade esto

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])) // Configura esto
  ]
};