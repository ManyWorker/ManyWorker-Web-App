import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../../model/Categoria';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.html',
  styleUrls: ['./categoria.css']
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  nuevaCategoria: Categoria = { titulo: '', leyesAplicables: '' };

  constructor(private categoriaService: CategoriaService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
    this.cdr.detectChanges();
  }

  guardar() {
    if (this.nuevaCategoria.titulo && this.nuevaCategoria.leyesAplicables) {
      this.categoriaService.crear(this.nuevaCategoria).subscribe({
        next: () => {
          alert('Categoría creada correctamente');
          this.nuevaCategoria = { titulo: '', leyesAplicables: '' };
          this.cargarCategorias();
        },
        error: (err) => alert('Error al guardar: ' + err.message)
      });
    }
  }

  borrar(id?: number) {
    if (id && confirm('¿Seguro que quieres eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id).subscribe(() => this.cargarCategorias());
    }
  }
}