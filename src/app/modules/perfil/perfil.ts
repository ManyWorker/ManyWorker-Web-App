import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. IMPORTAR
import { FormsModule } from '@angular/forms';
import { UserProfile } from '../../../model/userProfile';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {
  profile: UserProfile = {} as UserProfile;
  originalProfile: UserProfile = {} as UserProfile;

  isLoading = true;
  isEditing = false;
  errorMessage = '';
  successMessage = '';

  currentUser: { id: number; role: string } | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef, // <--- 2. INYECTAR
  ) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('usuario');

    if (userString) {
      try {
        const userData = JSON.parse(userString);
        this.currentUser = { id: userData.id, role: userData.rol };

        this.loadProfile();
      } catch (e) {
        this.errorMessage = 'Error al leer datos de sesión. Por favor, loguéate de nuevo.';
        this.isLoading = false;
      }
    } else {
      this.errorMessage = 'No has iniciado sesión.';
      this.isLoading = false;
      setTimeout(() => this.router.navigate(['/login']), 1500);
    }
  }

  loadProfile(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.cd.detectChanges(); // Forzar spinner

    this.profileService.getProfile(this.currentUser.role, this.currentUser.id).subscribe({
      next: (data) => {
        console.log('Perfil cargado:', data);
        this.profile = data;
        this.originalProfile = { ...data };
        this.profile.rol = this.currentUser!.role as any;

        this.isLoading = false;
        this.cd.detectChanges(); // <--- 3. FORZAR ACTUALIZACIÓN AL RECIBIR DATOS
      },
      error: (err) => {
        console.error('Error backend:', err);
        this.errorMessage = 'Error al cargar el perfil. Verifica tu conexión.';
        this.isLoading = false;
        this.cd.detectChanges(); // <--- 3. FORZAR ACTUALIZACIÓN SI HAY ERROR
      },
    });
  }

  toggleEdit(): void {
    if (this.isEditing) {
      this.profile = { ...this.originalProfile };
    }
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';
    // No suele ser necesario aquí, pero si el botón no cambia, descomenta la siguiente línea:
    // this.cd.detectChanges();
  }
  changePassword(): void {
    this.router.navigate(['/cambiar-contrasena']);
  }

  saveProfile(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.cd.detectChanges(); // Mostrar spinner

    this.profileService
      .updateProfile(this.currentUser.role, this.currentUser.id, this.profile)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Perfil actualizado correctamente.';
          this.originalProfile = { ...this.profile };
          this.isEditing = false;
          this.isLoading = false;
          this.cd.detectChanges(); // <--- 4. FORZAR ACTUALIZACIÓN AL GUARDAR
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error al guardar los cambios.';
          this.isLoading = false;
          this.cd.detectChanges(); // <--- 4. FORZAR ACTUALIZACIÓN SI FALLA
        },
      });
  }
}
