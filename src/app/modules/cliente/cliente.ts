import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../model/cliente'; 
import { Tarea } from '../../../model/Tarea';
import { ClienteService } from '../../services/ClienteService';

@Component({
  selector: 'app-cliente-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.css'],
})
export class ClienteComponent implements OnInit {
  cliente: Cliente = { tareas: [] } as unknown as Cliente;
  
  // Ajustado a tu interfaz: id es opcional al crear, números a 0
  nuevaTarea: Tarea = {
    id: 0,
    contenido: '',
    precioBase: 0,
    tiempoEstimado: 0
  };

  activeTab: 'mis-tareas' | 'solicitudes' = 'mis-tareas';
  isLoading = true;
  errorMessage = '';
  successMessage = '';
  currentUser: any = null;

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('usuario');
    if (userString) {
      this.currentUser = JSON.parse(userString);
      this.loadData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.cd.detectChanges();
    this.clienteService.getById(this.currentUser.id).subscribe({
      next: (data) => {
        this.cliente = data;
        if (!this.cliente.tareas) this.cliente.tareas = [];
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al cargar tus datos.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  saveTarea(): void {
    if (!this.nuevaTarea.contenido) {
      this.errorMessage = 'El contenido de la tarea es obligatorio.';
      return;
    }

    this.isLoading = true;
    // Creamos una copia para evitar problemas de referencia
    const tareaParaEnviar = { ...this.nuevaTarea };
    
    this.cliente.tareas.push(tareaParaEnviar);

    this.clienteService.update(this.currentUser.id, this.cliente).subscribe({
      next: () => {
        this.successMessage = 'Tarea publicada correctamente.';
        this.nuevaTarea = { id: 0, contenido: '', precioBase: 0, tiempoEstimado: 0 };
        this.loadData();
      },
      error: (err) => {
        this.errorMessage = 'Fallo al guardar en el servidor.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  deleteTarea(index: number): void {
    if (!confirm('¿Borrar esta tarea?')) return;
    this.cliente.tareas.splice(index, 1);
    this.clienteService.update(this.currentUser.id, this.cliente).subscribe(() => this.loadData());
  }
}