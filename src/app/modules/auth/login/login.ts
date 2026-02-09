import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ActorLogin } from '../../../models/actor-login';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Auth {
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