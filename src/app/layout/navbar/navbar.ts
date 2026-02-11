import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <--- IMPORTANTE
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta a tu servicio

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule], // <--- Añadir CommonModule aquí
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  // Propiedad para verificar si está logueado
  get isLoggedIn(): boolean {
    // Verifica si existe el token en el almacenamiento
    return !!sessionStorage.getItem('token');
  }


  // Getter para saber si es cliente
  get isCliente(): boolean {
    return this.authService.hasRole('CLIENTE');
  }

  // Getter para saber si es trabajador
  get isTrabajador(): boolean {
    return this.authService.hasRole('TRABAJADOR');
  }

  // Getter para saber si es cliente
  get isAdmin(): boolean {
    return this.authService.hasRole('ADMINISTRADOR');
  }

  // Método para cerrar sesión
  logout(): void {
    this.authService.logout(); // Esto borra el sessionStorage (según definimos antes)
    this.router.navigate(['/login']); // Redirige al login
  }
}