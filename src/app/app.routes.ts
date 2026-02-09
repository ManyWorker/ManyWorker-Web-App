import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth';

// Importamos los componentes
//import { AdminComponent } from './modules/admin/admin';
//import { ClienteComponent } from './modules/cliente/cliente';
//import { TrabajadorComponent } from './modules/trabajador/trabajador';
//import { MensajesComponent } from './modules/mensajes/mensajes';
import { CategoriaListComponent } from '../components/categoria_list.component';

// Importamos los guards de seguridad
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
    // Ruta pública: Login
    { path: 'login', component: AuthComponent },
    
    // Ruta por defecto: Redirigir al login si está vacía
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // --- RUTAS PROTEGIDAS ---

    // 1. Panel de ADMINISTRADOR
    { 
        path: 'admin', 
  //      component: AdminComponent,
        canActivate: [authGuard, roleGuard], // Necesita login Y ser admin
        data: { expectedRole: 'ADMIN' }      // El rol que esperamos (¡OJO CON LAS MAYÚSCULAS!)
    },

    // 2. Panel de CLIENTE
    { 
        path: 'cliente', 
    //    component: ClienteComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'CLIENTE' }
    },

    // 3. Panel de TRABAJADOR
    { 
        path: 'trabajador', 
    //    component: TrabajadorComponent,
        canActivate: [authGuard, roleGuard],
        data: { expectedRole: 'TRABAJADOR' }
    },

    // 4. Ejemplo de ruta común (solo necesita estar logueado, cualquier rol sirve)
    { 
        path: 'mensajes', 
    //    component: MensajesComponent,
        canActivate: [authGuard] 
    },

    // Ruta comodín: Si ponen una URL rara, volver al login
    { path: '**', redirectTo: '/login' },
    
    { path: 'categorias', component: CategoriaListComponent },
    { path: '', redirectTo: '/categorias', pathMatch: 'full' }
];