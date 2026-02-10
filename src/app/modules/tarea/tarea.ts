import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarea } from '../../../model/Tarea';
import { Categoria } from '../../../model/Categoria';
import { TareaService } from '../../services/TareaService';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-tarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: 'tarea.html',  
  styleUrls: ['tarea.css']    
})
export class TareaComponent implements OnInit {

  tareas: Tarea[] = [];
  categorias: Categoria[] = []; 
  nuevaTarea: Tarea = new Tarea();

  constructor(
    private tareaService: TareaService,
    private categoriaService: CategoriaService
  ) { }

  ngOnInit(): void {
    this.cargarTareas();
    this.cargarCategorias(); 
  }

  cargarTareas(): void {
    this.tareaService.getAll().subscribe({
      next: (data) => this.tareas = data,
      error: (e) => console.error('Error cargando tareas', e)
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe({
      next: (data: any) => this.categorias = data,
      error: (e: any) => console.error('Error cargando categorías', e)
    });
  }

  guardarTarea(): void {
    if (!this.nuevaTarea.categoria) {
      alert('Por favor selecciona una categoría');
      return;
    }
    
    this.tareaService.create(this.nuevaTarea).subscribe({
      next: (res) => {
        alert('Tarea creada con éxito');
        this.cargarTareas(); 
        this.nuevaTarea = new Tarea(); // Reseteamos el formulario
      },
      error: (e) => console.error('Error guardando tarea', e)
    });
  }
  
  eliminarTarea(id: number): void {
    if(confirm('¿Borrar tarea?')) {
        this.tareaService.delete(id).subscribe(() => this.cargarTareas());
    }
  }
}