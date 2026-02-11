import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../services/ClienteService';
import { TutorialService } from '../../services/tutorial.service';

@Component({
  selector: 'app-trabajador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trabajador.html',
  styleUrls: ['./trabajador.css']
})
export class TrabajadorComponent implements OnInit {
  activeTab: string = 'catalogo';
  clientesConTareas: Cliente[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  currentUser: any = null;

  // --- Tutoriales ---
  misTutoriales: any[] = [];
  isLoadingTutoriales: boolean = false;

  // Formulario de tutorial
  showTutorialForm: boolean = false;
  editingTutorialId: number | null = null;
  tutorialForm = {
    titulo: '',
    resumen: '',
    texto: '',
    imagenes: ''  // Separadas por comas
  };

  constructor(
    private clienteService: ClienteService,
    private tutorialService: TutorialService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('usuario');
    if (userString) {
      this.currentUser = JSON.parse(userString);
      this.loadCatalogo();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCatalogo(): void {
    this.isLoading = true;
    this.clienteService.getAll().subscribe({
      next: (data: Cliente[]) => {
        this.clientesConTareas = data.filter(c => c.tareas && c.tareas.length > 0);
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.errorMessage = 'No se pudo cargar el catálogo.';
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  enviarSolicitud(tareaId: number): void {
    console.log('Solicitud enviada para la tarea:', tareaId);
    this.successMessage = '¡Solicitud enviada con éxito!';
    setTimeout(() => {
      this.successMessage = '';
      this.cd.detectChanges();
    }, 3000);
  }

  // ===== TUTORIALES =====

  onTabChange(tab: string): void {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    if (tab === 'tutoriales') {
      this.loadTutoriales();
    }
  }

  loadTutoriales(): void {
    if (!this.currentUser) return;
    this.isLoadingTutoriales = true;
    this.cd.detectChanges();

    this.tutorialService.findByAutorId(this.currentUser.id).subscribe({
      next: (data) => {
        this.misTutoriales = data || [];
        this.isLoadingTutoriales = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        // 204 No Content se trata como lista vacía
        this.misTutoriales = [];
        this.isLoadingTutoriales = false;
        this.cd.detectChanges();
      }
    });
  }

  openCreateTutorial(): void {
    this.showTutorialForm = true;
    this.editingTutorialId = null;
    this.tutorialForm = { titulo: '', resumen: '', texto: '', imagenes: '' };
  }

  openEditTutorial(tutorial: any): void {
    this.showTutorialForm = true;
    this.editingTutorialId = tutorial.id;
    this.tutorialForm = {
      titulo: tutorial.titulo,
      resumen: tutorial.resumen,
      texto: tutorial.texto,
      imagenes: tutorial.imagenes ? tutorial.imagenes.join(', ') : ''
    };
  }

  cancelTutorialForm(): void {
    this.showTutorialForm = false;
    this.editingTutorialId = null;
  }

  saveTutorial(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.tutorialForm.titulo.trim() || !this.tutorialForm.resumen.trim() || !this.tutorialForm.texto.trim()) {
      this.errorMessage = 'Título, resumen y texto son obligatorios.';
      return;
    }

    const imagenesArray = this.tutorialForm.imagenes
      ? this.tutorialForm.imagenes.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const payload = {
      titulo: this.tutorialForm.titulo,
      resumen: this.tutorialForm.resumen,
      texto: this.tutorialForm.texto,
      imagenes: imagenesArray
    };

    this.isLoadingTutoriales = true;
    this.cd.detectChanges();

    if (this.editingTutorialId) {
      // Actualizar
      this.tutorialService.update(this.editingTutorialId, payload).subscribe({
        next: () => {
          this.successMessage = 'Tutorial actualizado correctamente.';
          this.showTutorialForm = false;
          this.editingTutorialId = null;
          this.loadTutoriales();
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar el tutorial.';
          this.isLoadingTutoriales = false;
          this.cd.detectChanges();
        }
      });
    } else {
      // Crear
      this.tutorialService.create(payload).subscribe({
        next: () => {
          this.successMessage = '¡Tutorial creado correctamente!';
          this.showTutorialForm = false;
          this.loadTutoriales();
        },
        error: (err) => {
          this.errorMessage = typeof err.error === 'string' ? err.error : 'Error al crear el tutorial.';
          this.isLoadingTutoriales = false;
          this.cd.detectChanges();
        }
      });
    }
  }

  deleteTutorial(id: number): void {
    if (!confirm('¿Estás seguro de eliminar este tutorial?')) return;

    this.tutorialService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Tutorial eliminado.';
        this.loadTutoriales();
      },
      error: () => {
        this.errorMessage = 'Error al eliminar el tutorial.';
        this.cd.detectChanges();
      }
    });
  }
}