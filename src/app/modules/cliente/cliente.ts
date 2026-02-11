import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Cliente } from '../../../model/cliente'; 
import { Tarea } from '../../../model/Tarea';
import { Categoria } from '../../../model/Categoria';
import { ClienteService } from '../../services/ClienteService';
import { TareaService } from '../../services/TareaService';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-cliente-gestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.html',
  styleUrls: ['./cliente.css'],
})
export class ClienteComponent implements OnInit {
  
  cliente: Cliente = { 
    id: 0, nombre: '', apellido: '', correo: '', telefono: '', direccion: '', tareas: []
  } as any; 
  
  categorias: Categoria[] = [];

  nuevaTarea: Tarea = {
    id: 0, descripcion: '', precioMax: null, direccion: '', solicitudes: []
  } as any;

  activeTab: 'mis-tareas' | 'solicitudes' = 'mis-tareas';
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  currentUser: any = null;

  constructor(
    private clienteService: ClienteService,
    private tareaService: TareaService,
    private categoriaService: CategoriaService,
    private router: Router,
    private cd: ChangeDetectorRef // <--- Inyectado
  ) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('usuario');
    if (userString) {
      this.currentUser = JSON.parse(userString);
      this.loadData();
      this.cargarCategorias();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.clienteService.getById(this.currentUser.id).subscribe({
      next: (data) => {
        this.cliente = data;
        if (!this.cliente.tareas) this.cliente.tareas = [];
        this.isLoading = false;
        // Forzamos a Angular a pintar la lista recibida
        this.cd.detectChanges(); 
      },
      error: (e) => {
        console.error('Error:', e);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data: any) => {
        this.categorias = data;
        this.cd.detectChanges();
      },
      error: (e) => console.error('Error cargando categorías', e)
    });
  }

  saveTarea(): void {
    if (!this.nuevaTarea.descripcion || !this.nuevaTarea.categoria) {
      this.errorMessage = 'Descripción y Categoría son obligatorias.';
      return;
    }
    
    this.isLoading = true;
    (this.nuevaTarea as any).contenido = this.nuevaTarea.descripcion;
    (this.nuevaTarea as any).cliente = this.cliente; 

    this.tareaService.create(this.nuevaTarea).subscribe({
      next: (tareaCreada) => {
        this.successMessage = 'Tarea publicada correctamente.';
        if (!this.cliente.tareas) this.cliente.tareas = [];
        this.cliente.tareas.push(tareaCreada);
        
        // Limpiar formulario
        this.nuevaTarea = {
            id: 0, descripcion: '', precioMax: null, direccion: '', solicitudes: [], categoria: undefined
        } as any;
        
        this.isLoading = false;
        this.cd.detectChanges(); // Forzamos a mostrar la nueva tarea y limpiar campos

        setTimeout(() => {
            this.successMessage = '';
            this.cd.detectChanges();
        }, 3000);
      },
      error: (err) => {
        this.errorMessage = 'Error al guardar.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  deleteTarea(index: number): void {
    if (!this.cliente.tareas) return;
    const tarea = this.cliente.tareas[index];
    if (!confirm('¿Seguro que quieres borrar esta tarea?')) return;
    
    if (tarea && tarea.id) {
        this.isLoading = true;
        this.tareaService.delete(tarea.id).subscribe({
            next: () => {
                if (this.cliente.tareas) this.cliente.tareas.splice(index, 1);
                this.isLoading = false;
                this.cd.detectChanges(); // Forzamos a quitar la tarea de la tabla
            },
            error: () => {
                this.isLoading = false;
                this.cd.detectChanges();
            }
        });
    }
  }
}