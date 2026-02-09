import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActorLogin } from '../../models/actor-login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html'
})
export class AuthComponent {
  user: ActorLogin = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.user).subscribe({
      next: (res) => {
        alert('Bienvenido ' + res.username);
        this.router.navigate(['/']); // Redirigir al inicio tras el éxito
      },
      error: () => alert('Error de autenticación')
    });
  }
}