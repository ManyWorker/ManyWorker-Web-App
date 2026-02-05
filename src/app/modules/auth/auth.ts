import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActorLogin } from '../../models/actor-login';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth.html'
})
export class AuthComponent {
  user: ActorLogin = { username: '', password: '' };

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.user).subscribe({
      next: (res) => alert('Login exitoso: ' + res.username),
      error: (err) => alert('Error de acceso')
    });
  }
}