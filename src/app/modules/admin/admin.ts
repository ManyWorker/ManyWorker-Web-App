import { Component } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  categorias: any[] = []; 

  constructor(private categoriaService: CategoriaService) {}

  borrarCategoria(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => {
          this.categorias = this.categorias.filter(c => c.id !== id);
          alert('Categoría eliminada con éxito');
        },
        error: (err) => {
          console.error(err);
          alert('No se pudo eliminar: ' + (err.error?.message || 'Error del servidor'));
        }
      });
    }
  }
}
