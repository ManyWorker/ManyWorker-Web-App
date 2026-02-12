import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TutorialService } from '../../services/tutorial.service';
import { AuthService } from '../../services/auth.service';

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

  // Formulario
  mostrarFormulario: boolean = false;
  nuevoTutorial = { titulo: '', resumen: '', texto: '', imagenes: [] as string[] };
  nuevaImagen: string = '';
  guardando: boolean = false;

  // Rol
  esTrabajador: boolean = false;
  userId: number | null = null;

  constructor(
    private tutorialService: TutorialService,
    private authService: AuthService
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
    this.tutorialService.findAll().subscribe({
      next: (data) => {
        this.tutoriales = data;
        this.cargando = false;
      },
      error: (err) => {
        if (err.status !== 204) {
          this.errorMensaje = 'Error al cargar los tutoriales.';
        }
        this.cargando = false;
      }
    });
  }

  cargarMisTutoriales() {
    if (!this.userId) return;
    this.tutorialService.findByAutorId(this.userId).subscribe({
      next: (data) => this.misTutoriales = data,
      error: () => this.misTutoriales = []
    });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  agregarImagen() {
    const url = this.nuevaImagen.trim();
    if (url) {
      this.nuevoTutorial.imagenes.push(url);
      this.nuevaImagen = '';
    }
  }

  quitarImagen(index: number) {
    this.nuevoTutorial.imagenes.splice(index, 1);
  }

  crearTutorial() {
    if (!this.nuevoTutorial.titulo.trim() || !this.nuevoTutorial.texto.trim()) {
      alert('El título y el contenido son obligatorios.');
      return;
    }

    this.guardando = true;
    this.tutorialService.create(this.nuevoTutorial).subscribe({
      next: () => {
        alert('Tutorial creado correctamente.');
        this.nuevoTutorial = { titulo: '', resumen: '', texto: '', imagenes: [] };
        this.mostrarFormulario = false;
        this.guardando = false;
        this.cargarTutoriales();
        this.cargarMisTutoriales();
      },
      error: (err) => {
        alert('Error al crear el tutorial: ' + (err.error || err.message));
        this.guardando = false;
      }
    });
  }

  esMio(tutorial: any): boolean {
    return this.esTrabajador && this.userId != null && tutorial.autor?.id === this.userId;
  }

  eliminarTutorial(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este tutorial?')) return;

    this.tutorialService.delete(id).subscribe({
      next: () => {
        this.cargarTutoriales();
        this.cargarMisTutoriales();
      },
      error: (err) => {
        if (err.status === 200) {
          this.cargarTutoriales();
          this.cargarMisTutoriales();
        } else {
          alert('Error al eliminar el tutorial.');
        }
      }
    });
  }
}