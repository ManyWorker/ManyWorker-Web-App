import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../../model/Categoria';
import { finalize } from 'rxjs/operators'; 

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
  cargando: boolean = false;

  constructor(private categoriaService: CategoriaService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
	this.cargando = true;
	this.cdr.detectChanges();

    this.categoriaService.listar()
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges(); 
        })
      ).subscribe(data => this.categorias = data);
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
      this.categoriaService.eliminarCategoria(id).subscribe({
        next: () => this.cargarCategorias(),
        error: (err) => console.error('Error al borrar:', err)
      });
    }
  }
}