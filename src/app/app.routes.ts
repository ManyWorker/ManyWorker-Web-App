import { Routes } from '@angular/router';

import { TutorialComponent } from './modules/tutorial/tutorial';

// Importamos los guards de seguridad
import { roleGuard } from './guards/role.guard';
import { Home } from './modules/home/home';
import { Auth } from './modules/auth/login/login';
import { RegisterComponent } from './modules/auth/register/register';
import { Perfil } from './modules/perfil/perfil';
import { Contrasena } from './modules/auth/contrasena/contrasena';
import { Mensajes } from './modules/mensajes/mensajes';
import { ClienteComponent } from './modules/cliente/cliente';
import { AdministradorComponent } from './modules/administrador/administrador';
import { TrabajadorComponent } from './modules/trabajador/trabajador';
import { MisSolicitudes } from './modules/mis-solicitudes/mis-solicitudes';
import { TareaComponent } from './modules/tarea/tarea';
import { CategoriaComponent } from './modules/categoria/categoria';
import { Error404Component } from './modules/error404/error404';

export const routes: Routes = [
    // Rutas públicas
    { path: 'login', component: Auth },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: Home },
    { path: '', component: Home }, // Página de inicio por defecto

    // Tutoriales y Perfil
    { path: 'tutorial', component: TutorialComponent },
    { path: 'tutoriales', component: TutorialComponent },
    { path: 'perfil', component: Perfil },
    { path: 'cambiar-contrasena', component: Contrasena },

    // Mensajería y Roles
    { path: 'mensajes', component: Mensajes },
    { path: 'tareas-disponibles', component: TrabajadorComponent },
    { path: 'administrador', component: AdministradorComponent },
    { path: 'mis-solicitudes', component: MisSolicitudes },

    // Gestión de Tareas y Categorías
    { path: 'tareas', component: TareaComponent },
    { path: 'categorias', component: CategoriaComponent },

    // GESTIÓN DE ERROR 404
    { path: '**', component: Error404Component }
];