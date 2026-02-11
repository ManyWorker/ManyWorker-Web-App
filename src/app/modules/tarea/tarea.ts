import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarea } from '../../../model/Tarea';
import { Categoria } from '../../../model/Categoria';
import { TareaService } from '../../services/TareaService';
import { CategoriaService } from '../../services/categoria.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'tarea.html',
  styleUrls: ['tarea.css'],
})
export class TareaComponent implements OnInit {
  tareas: Tarea[] = [];
  categorias: Categoria[] = [];

  nuevaTarea: Tarea = {
    id: 0,
    contenido: '',
    precioBase: 0,
    tiempoEstimado: 0,
    descripcion: '',
    direccion: '',
    precioMax: 0,
    solicitudes: [],
  };

  constructor(
    private tareaService: TareaService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
    this.cargarCategorias();
  }

  cargarTareas(): void {
    this.tareaService
      .getAll()
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.tareas = data;
          console.log('Tareas actualizadas');
        },
        error: (e) => console.error('Error cargando tareas', e),
      });
  }

  cargarCategorias(): void {
    this.categoriaService
      .listar()
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data: any) => {
          this.categorias = data;
          console.log('Categorías actualizadas');
        },
        error: (e: any) => console.error('Error cargando categorías', e),
      });
  }

  guardarTarea(): void {
    if (!this.nuevaTarea.categoria) {
      alert('Por favor selecciona una categoría');
      return;
    }

    (this.nuevaTarea as any).contenido = this.nuevaTarea.descripcion;

    this.tareaService.create(this.nuevaTarea).subscribe({
      next: (res) => {
        this.procesarExitoGuardado();
      },
      error: (e) => {
        if (e.status === 201 || e.status === 200) {
          console.log('Backend devolvió texto en vez de JSON, pero la operación fue exitosa.');
          this.procesarExitoGuardado();
        } else {
          console.error('Error real guardando tarea', e);
          alert('Error al guardar: ' + (e.error?.message || e.message));
        }
      },
    });
  }

  private procesarExitoGuardado(): void {
    alert('Tarea creada con éxito');
    this.cargarTareas();

    this.nuevaTarea = {
      id: 0,
      contenido: '',
      precioBase: 0,
      tiempoEstimado: 0,
      descripcion: '',
      direccion: '',
      precioMax: 0,
      solicitudes: [],
    };
    this.cdr.detectChanges();
  }

  eliminarTarea(id: number): void {
    if (confirm('¿Borrar tarea?')) {
      this.tareaService.delete(id).subscribe({
        next: () => {
          this.cargarTareas();
        },
        error: (e) => {
          if (e.status === 200) {
            console.log('Eliminado con éxito (respuesta de texto)');
            this.cargarTareas();
          } else {
            console.error('Error real al eliminar', e);
            alert('No se pudo eliminar la tarea');
          }
        },
      });
    }
  }
}
