import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  activeTab: 'categorias' | 'nuevo-admin' | 'broadcast' = 'categorias';
  isLoading = false;
  successMsg = '';
  errorMsg = '';

  categorias: Categoria[] = [];
  
  // Usamos tipo any para evitar conflictos con las interfaces Actor/ActorLogin
  nuevoAdmin: any = {
    nombre: '',
    apellido: '',
    apellido2: '',
    correo: '',
    telefono: '',
    direccion: '',
    username: '', 
    password: '', 
    version: 0,
    foto: ''
  };

  broadcast = { asunto: '', cuerpo: '' };

  constructor(
    private adminService: AdminService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  switchTab(tab: 'categorias' | 'nuevo-admin' | 'broadcast'): void {
    this.activeTab = tab;
    this.successMsg = '';
    this.errorMsg = '';
    if (tab === 'categorias') this.loadCategorias();
  }

  loadCategorias(): void {
    this.isLoading = true;
    this.adminService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data || [];
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMsg = 'Error al cargar las categorías.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
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
    if (cat.tareas && cat.tareas.length > 0) {
      alert('No se puede eliminar: tiene tareas asociadas.');
      return;
    }
    if (!confirm('¿Seguro que quieres eliminar esta categoría?')) return;

    this.adminService.deleteCategoria(cat.id).subscribe({
      next: () => {
        this.successMsg = 'Categoría eliminada.';
        this.loadCategorias();
      },
      error: () => { this.errorMsg = 'Error al eliminar.'; }
    });
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