import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {

  user = {
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    rol: 'CLIENTE', // Valor por defecto
    nombreComercial: '' // Solo para trabajadores
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.successMessage = 'Registro completado con éxito. Redirigiendo al login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = 'Error al registrarse: ' + (err.error?.message || 'Error del servidor');
        console.error(err);
      }
    });
  }

  // Helper para saber si mostrar campos de trabajador
  isWorker(): boolean {
    return this.user.rol === 'TRABAJADOR';
  }
}