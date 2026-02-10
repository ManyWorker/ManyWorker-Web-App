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
import { Cliente } from './modules/cliente/cliente';
import { TareaComponent } from './modules/tarea/tarea';

export const routes: Routes = [
    // Ruta pública: Login
    { path: 'login', component: Auth},
	{ path: 'register', component: RegisterComponent},


    { path: 'tutorial', component: TutorialComponent },
    
    // Ruta por defecto: Redirigir al login si está vacía
    { path: '', component: Home },
	{ path: 'home', component: Home },


	// Ruta para tutoriales publico
	{ path: 'tutoriales', component: TutorialComponent },
	// Ruta para el perfil personal
	{ path: 'perfil', component: Perfil },
	{ path: 'cambiar-contrasena', component: Contrasena },
	

	// Ruta para enviar mensajes
	{ path: 'mensajes', component: Mensajes },

	{ path: 'mis-tareas', component: Cliente },

	// Ruta para gestión de Tareas
    { path: 'tareas', component: TareaComponent },

];