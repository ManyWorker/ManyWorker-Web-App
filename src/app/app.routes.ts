import { Routes } from '@angular/router';

// Importamos los componentes
//import { AdminComponent } from './modules/admin/admin';
//import { ClienteComponent } from './modules/cliente/cliente';
//import { TrabajadorComponent } from './modules/trabajador/trabajador';
//import { MensajesComponent } from './modules/mensajes/mensajes';
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



	


];