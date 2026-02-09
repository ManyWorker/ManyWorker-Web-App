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

export const routes: Routes = [
    // Ruta pública: Login
    { path: 'login', component: Auth},
	{ path: 'register', component: RegisterComponent},


    { path: 'tutorial', component: TutorialComponent },
    
    // Ruta por defecto: Redirigir al login si está vacía
    { path: '', component: Home },


];