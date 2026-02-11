import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SolicitudService } from '../../services/SolicitudService';
import { TareaService } from '../../services/TareaService';
import { Solicitud } from '../../../model/Solicitud';
import { Tarea } from '../../../model/Tarea';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-gestionar-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestionar-solicitudes.html',
  styleUrls: ['./gestionar-solicitudes.css'],
})
export class GestionarSolicitudes implements OnInit {
  
  tareaIdOriginal: string = ''; 
  tareaSeleccionada: Tarea | null = null;
  solicitudesRecibidas: Solicitud[] = [];
  
  loading: boolean = true;
  mensajeError: string = '';

  constructor(
    private route: ActivatedRoute,
    private solicitudService: SolicitudService,
    private tareaService: TareaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.tareaIdOriginal = this.route.snapshot.paramMap.get('id') || '';
    const idNumerico = parseInt(this.tareaIdOriginal.split('-')[0], 10);

    if (!isNaN(idNumerico)) {
      this.cargarDatos(this.tareaIdOriginal); 
    } else {
      this.mensajeError = 'Identificador de tarea no válido.';
      this.loading = false;
    }
  }

  cargarDatos(idString: string): void {
    this.loading = true;
    this.cdr.detectChanges();

    // 1. Cargamos los datos de la tarea para la cabecera
    this.tareaService.getById(idString).subscribe({
      next: (tarea) => {
        this.tareaSeleccionada = tarea;
        
        // 2. Cargamos las solicitudes específicas usando el SolicitudService
        this.solicitudService.getSolicitudesByTarea(idString)
          .pipe(finalize(() => {
            this.loading = false;
            this.cdr.detectChanges();
          }))
          .subscribe({
            next: (solicitudes) => {
              this.solicitudesRecibidas = solicitudes || [];
            },
            error: (err) => {
              // Si da error 204 (No Content) lo tratamos como vacío, si es otro error lo mostramos
              if (err.status !== 204 && err.status !== 404) {
                 console.error('Error al cargar solicitudes', err);
              }
              this.solicitudesRecibidas = []; 
            }
          });
      },
      error: (err) => {
        console.error('Error al cargar la tarea', err);
        this.mensajeError = 'No se pudo cargar la información de esta tarea.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  aceptarSolicitud(solicitudId: number): void {
    if (confirm('¿Estás seguro de que quieres ACEPTAR a este trabajador?')) {
      this.solicitudService.aceptar(solicitudId).subscribe({
        next: () => {
          alert('¡Solicitud aceptada! Se ha notificado al trabajador.');
          this.cargarDatos(this.tareaIdOriginal); 
        },
        error: (err) => {
          console.error(err);
          alert('Error al aceptar la solicitud.');
        }
      });
    }
  }

  rechazarSolicitud(solicitudId: number): void {
    if (confirm('¿Estás seguro de que quieres RECHAZAR esta oferta?')) {
      this.solicitudService.rechazar(solicitudId).subscribe({
        next: () => {
          alert('Solicitud rechazada.');
          this.cargarDatos(this.tareaIdOriginal); 
        },
        error: (err) => {
          console.error(err);
          alert('Error al rechazar la solicitud.');
        }
      });
    }
  }
}