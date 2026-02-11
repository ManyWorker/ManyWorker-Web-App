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
    id: 0, descripcion: '', precioMax: 0, direccion: '', solicitudes: []
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
    private cd: ChangeDetectorRef
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
    this.clienteService.getById(this.currentUser.id).subscribe({
      next: (data) => {
        this.cliente = data;
        if (!this.cliente.tareas) this.cliente.tareas = [];
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (e) => {
        console.error('Error:', e);
        this.isLoading = false;
      }
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data: any) => this.categorias = data,
      error: (e) => console.error('Error cargando categorías', e)
    });
  }

  // --- ESTA ES LA FUNCIÓN QUE CAMBIA PARA VACIAR EL FORMULARIO ---
  saveTarea(): void {
    if (!this.nuevaTarea.descripcion) {
      this.errorMessage = 'La descripción es obligatoria.';
      return;
    }
    if (!this.nuevaTarea.categoria) {
      this.errorMessage = 'Debes seleccionar una categoría.';
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    (this.nuevaTarea as any).contenido = this.nuevaTarea.descripcion;
    (this.nuevaTarea as any).cliente = this.cliente; 

    this.tareaService.create(this.nuevaTarea).subscribe({
      next: (tareaCreada) => {
        this.successMessage = 'Tarea publicada correctamente.';
        this.isLoading = false;
        
        if (!this.cliente.tareas) this.cliente.tareas = [];
        this.cliente.tareas.push(tareaCreada);
        
        // AQUÍ ES DONDE SE VACÍAN LOS CAMPOS:
        this.nuevaTarea = {
            id: 0,
            descripcion: '',
            precioMax: null, 
            direccion: '',
            solicitudes: [],
            categoria: undefined 
        } as any;
        
        this.cd.detectChanges();

        // Borrar mensaje de éxito a los 3 seg
        setTimeout(() => {
            this.successMessage = '';
            this.cd.detectChanges();
        }, 3000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error al guardar. Revisa la consola.';
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
                if (this.cliente.tareas) {
                    this.cliente.tareas.splice(index, 1);
                }
                this.isLoading = false;
                this.cd.detectChanges();
            },
            error: () => {
                this.isLoading = false;
                this.errorMessage = 'Error al borrar.';
                this.cd.detectChanges();
            }
        });
    } else {
        if (this.cliente.tareas) {
            this.cliente.tareas.splice(index, 1);
        }
    }
  }
}