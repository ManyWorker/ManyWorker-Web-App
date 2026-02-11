import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { TareaService } from '../../services/TareaService';
import { SolicitudService } from '../../services/SolicitudService';
import { Tarea } from '../../../model/Tarea';
import { Solicitud } from '../../../model/Solicitud';
import { finalize } from 'rxjs/operators';

declare var bootstrap: any;

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './mis-solicitudes.html',
  styleUrls: ['./mis-solicitudes.css']
})
export class MisSolicitudes implements OnInit {

  tareasDisponibles: Tarea[] = [];
  misSolicitudesEnviadas: Solicitud[] = []; 
  
  loadingTareas: boolean = true;
  loadingSolicitudes: boolean = false; 
  mensajeError: string = '';

  // Variables para Modal de Enviar Solicitud
  tareaSeleccionada: any = null;
  precioModal: number | null = null;
  comentarioModal: string = '';
  modalInstance: any = null; 

  // Variables para Modal de Cancelar Solicitud
  solicitudACancelar: number | null = null;
  modalCancelarInstance: any = null;

  constructor(
    private tareaService: TareaService,
    private solicitudService: SolicitudService,
    public authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
    if (this.authService.hasRole('TRABAJADOR')) {
      this.cargarMisSolicitudes();
    }
  }

  cargarTareas(): void {
    this.loadingTareas = true;
    this.cdr.detectChanges(); 

    this.tareaService.getAll()
      .pipe(finalize(() => {
        this.loadingTareas = false;
        this.cdr.detectChanges(); 
      }))
      .subscribe({
        next: (data) => this.tareasDisponibles = data,
        error: (err) => {
          console.error('Error cargando tareas', err);
          this.mensajeError = 'Error al conectar con el servidor para las tareas.';
        }
      });
  }

  cargarMisSolicitudes(): void {
    this.loadingSolicitudes = true;
    this.cdr.detectChanges();

    this.solicitudService.getMisSolicitudes()
      .pipe(finalize(() => {
        this.loadingSolicitudes = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (todasLasSolicitudes) => {
          this.misSolicitudesEnviadas = todasLasSolicitudes || [];
        },
        error: (err) => console.error('Error cargando mis solicitudes', err)
      });
  }

  abrirModalSolicitud(tarea: any): void {
    const trabajadorId = this.authService.getUserId(); 
    if (!trabajadorId) {
      alert("Debes iniciar sesión como trabajador para aplicar.");
      this.router.navigate(['/login']);
      return;
    }

    this.tareaSeleccionada = tarea;
    this.precioModal = null; 
    this.comentarioModal = '';
    
    const modalElement = document.getElementById('modalSolicitud');
    if (modalElement) {
      this.modalInstance = new bootstrap.Modal(modalElement);
      this.modalInstance.show();
    }
  }

  confirmarSolicitudModal(): void {
    if (!this.tareaSeleccionada) return;

    if (!this.precioModal || isNaN(this.precioModal) || this.precioModal <= 0) {
      alert('Debes introducir un precio válido mayor a 0');
      return;
    }

    if (!this.comentarioModal || this.comentarioModal.trim().length < 10) {
      alert('El comentario es obligatorio y debe tener al menos 10 caracteres');
      return;
    }

    const trabajadorId = this.authService.getUserId(); 
    const nuevaSolicitud: Solicitud = {
      id: 0, 
      precioOfrecido: this.precioModal,
      comentario: this.comentarioModal.trim(),
      trabajador: { id: Number(trabajadorId) }, 
      tarea: { id: this.tareaSeleccionada.id }                  
    };

    this.solicitudService.create(nuevaSolicitud).subscribe({
      next: (res) => {
        if (this.modalInstance) {
          this.modalInstance.hide();
        }
        this.procesarExitoSolicitud(this.tareaSeleccionada.id);
      },
      error: (err) => {
        console.error('Error al aplicar', err);
        alert(`Hubo un error: ${err.error || 'No se pudo enviar la solicitud'}`);
      }
    });
  }

  private procesarExitoSolicitud(tareaId: number): void {
    alert('¡Solicitud enviada con éxito!');
    this.tareasDisponibles = this.tareasDisponibles.filter(t => t.id !== tareaId);
    this.cargarMisSolicitudes(); 
  }

  // --- NUEVA LÓGICA: MODAL DE CANCELAR SOLICITUD ---

  abrirModalCancelar(solicitudId: number): void {
    this.solicitudACancelar = solicitudId;
    
    const modalElement = document.getElementById('modalCancelar');
    if (modalElement) {
      this.modalCancelarInstance = new bootstrap.Modal(modalElement);
      this.modalCancelarInstance.show();
    }
  }

  confirmarCancelacion(): void {
    if (!this.solicitudACancelar) return;

    this.solicitudService.delete(this.solicitudACancelar).subscribe({
      next: () => {
        if (this.modalCancelarInstance) {
          this.modalCancelarInstance.hide();
        }
        
        alert('Solicitud cancelada correctamente'); 
        
        this.solicitudACancelar = null; 
        this.cargarMisSolicitudes(); 
        this.cargarTareas(); 
      },
      error: (err) => {
        console.error('Error al cancelar', err);
        alert('Error al cancelar la solicitud');
        if (this.modalCancelarInstance) {
          this.modalCancelarInstance.hide();
        }
      }
    });
  }
}