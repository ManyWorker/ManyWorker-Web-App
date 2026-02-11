import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 1. Importación necesaria
import { AdminService } from '../../services/AdministradorService';
import { Categoria } from '../../../model/Categoria';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css']
})
export class AdministradorComponent implements OnInit {

  activeTab: 'categorias' | 'nuevo-admin' | 'broadcast' | 'usuarios' = 'categorias';
  isLoading = false;
  successMsg = '';
  errorMsg = '';
  currentUser: any = null; 

  categorias: Categoria[] = [];
  
  nuevoAdmin: any = {
    nombre: '', apellido: '', apellido2: '', correo: '',
    telefono: '', direccion: '', username: '', password: '', 
    version: 0, foto: ''
  };

  broadcast = { asunto: '', cuerpo: '' };

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef,
    private router: Router // 2. Inyectado correctamente
  ) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('usuario');
    if (userString) {
      this.currentUser = JSON.parse(userString);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // 4. Corregido: añadido 'usuarios' al parámetro para que coincida con la propiedad
  switchTab(tab: 'categorias' | 'nuevo-admin' | 'broadcast' | 'usuarios'): void {
    this.activeTab = tab;
    this.successMsg = '';
    this.errorMsg = '';

  }


  onRegisterAdmin(): void {
    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';

    this.adminService.createAdmin(this.nuevoAdmin).subscribe({
      next: (resp: any) => { 
        this.successMsg = `¡Administrador ${this.nuevoAdmin.username} creado con éxito!`;
        this.resetForm();
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = err.error?.message || 'Error al crear la cuenta.';
        this.cd.detectChanges();
      }
    });
  }

  onDeleteCategoria(cat: Categoria): void {
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return;
    if (cat.id == null) {
      this.errorMsg = 'La categoría no tiene un ID válido.';
      return;
    }

  }

  onSendBroadcast(): void {
    this.isLoading = true;
    this.adminService.sendBroadcast(this.broadcast.asunto, this.broadcast.cuerpo).subscribe({
      next: () => {
        this.successMsg = 'Mensaje enviado a todos los usuarios.';
        this.broadcast = { asunto: '', cuerpo: '' };
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Error al enviar el broadcast.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  private resetForm() {
    this.nuevoAdmin = {
      nombre: '', apellido: '', apellido2: '', correo: '',
      telefono: '', direccion: '', username: '', password: '',
      version: 0, foto: ''
    };
  }
}