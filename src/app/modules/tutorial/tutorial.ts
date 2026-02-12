import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorialService } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutorial.html',
  styleUrls: ['./tutorial.css']
})
export class TutorialComponent implements OnInit {

  tutoriales: any[] = [];
  misTutoriales: any[] = [];
  cargando: boolean = false;
  errorMensaje: string = '';

  // Variables para el formulario
  mostrarFormulario: boolean = false;
  guardando: boolean = false;
  
  nuevoTutorial = {
    titulo: '',
    resumen: '',
    texto: '',
    imagenes: [] as string[]
  };
  
  nuevaImagenUrl: string = '';

  // Datos del usuario
  esTrabajador: boolean = false;
  userId: number | null = null;

  constructor(
    private tutorialService: TutorialService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef // Inyectado para forzar actualizaciones de vista
  ) {}

  ngOnInit() {
    this.esTrabajador = this.authService.hasRole('TRABAJADOR');
    this.userId = this.authService.getUserId();

    this.cargarTutoriales();
    
    if (this.esTrabajador && this.userId) {
      this.cargarMisTutoriales();
    }
  }

  cargarTutoriales() {
    this.cargando = true;
    this.cdr.detectChanges(); // Mostrar spinner inmediatamente

    this.tutorialService.findAll()
      .pipe(
        finalize(() => {
          this.cargando = false;
          this.cdr.detectChanges(); // Quitar spinner y refrescar lista
        })
      )
      .subscribe({
        next: (data) => {
          this.tutoriales = data || [];
          console.log('Tutoriales generales cargados');
        },
        error: (err) => {
          if (err.status !== 204) {
            this.errorMensaje = 'No se pudieron cargar los tutoriales.';
          }
          console.error(err);
        }
      });
  }

  cargarMisTutoriales() {
    if (!this.userId) return;
    
    this.tutorialService.findByAutorId(this.userId)
      .pipe(
        finalize(() => this.cdr.detectChanges())
      )
      .subscribe({
        next: (data) => {
          this.misTutoriales = data || [];
          console.log('Mis tutoriales cargados');
        },
        error: (err) => console.error('Error cargando mis tutoriales', err)
      });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.cdr.detectChanges();
  }

  agregarImagen() {
    if (this.nuevaImagenUrl && this.nuevaImagenUrl.trim() !== '') {
      this.nuevoTutorial.imagenes.push(this.nuevaImagenUrl.trim());
      this.nuevaImagenUrl = '';
      this.cdr.detectChanges();
    }
  }

  quitarImagen(index: number) {
    this.nuevoTutorial.imagenes.splice(index, 1);
    this.cdr.detectChanges();
  }

  crearTutorial() {
    if (!this.nuevoTutorial.titulo || !this.nuevoTutorial.texto) {
      alert('El título y el contenido son obligatorios');
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    this.tutorialService.create(this.nuevoTutorial).subscribe({
      next: () => this.procesarExitoCreacion(),
      error: (err) => {
        // Manejo de éxito cuando el backend devuelve texto pero código 201/200
        if (err.status === 201 || err.status === 200) {
          this.procesarExitoCreacion();
        } else {
          console.error(err);
          this.guardando = false;
          alert('Error al publicar el tutorial.');
          this.cdr.detectChanges();
        }
      }
    });
  }

  private procesarExitoCreacion() {
    alert('¡Tutorial publicado con éxito!');
    this.guardando = false;
    this.mostrarFormulario = false;
    this.nuevoTutorial = { titulo: '', resumen: '', texto: '', imagenes: [] };
    this.nuevaImagenUrl = '';
    
    this.cargarTutoriales();
    this.cargarMisTutoriales();
  }

  eliminarTutorial(id: number) {
    if (!confirm('¿Estás seguro de que deseas eliminar este tutorial?')) return;

    this.tutorialService.delete(id).subscribe({
      next: () => this.finalizarEliminacion(id),
      error: (err) => {
        // Manejo de éxito si devuelve texto (status 200)
        if (err.status === 200) {
          this.finalizarEliminacion(id);
        } else {
          console.error(err);
          alert('No se pudo eliminar el tutorial.');
        }
      }
    });
  }

  private finalizarEliminacion(id: number) {
    // Optimización: Eliminar de los arrays locales inmediatamente
    this.tutoriales = this.tutoriales.filter(t => t.id !== id);
    this.misTutoriales = this.misTutoriales.filter(t => t.id !== id);
    this.cdr.detectChanges();
    alert('Tutorial eliminado correctamente.');
  }
}