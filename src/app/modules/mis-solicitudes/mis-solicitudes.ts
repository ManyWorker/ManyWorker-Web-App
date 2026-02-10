
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Asegúrate de importar esto si usas servicios aquí
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TareaService } from '../../services/TareaService';
import { SolicitudService } from '../../services/SolicitudService';
import { Tarea } from '../../../model/Tarea';
import { Solicitud } from '../../../model/Solicitud';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './mis-solicitudes.html',
  styleUrls: ['./mis-solicitudes.css']
})
export class MisSolicitudes implements OnInit {

  tareasDisponibles: Tarea[] = [];
  loading: boolean = true;
  mensaje: string = '';

  constructor(
    private tareaService: TareaService,
    private solicitudService: SolicitudService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas(): void {
    this.loading = true;
    this.tareaService.getAll().subscribe({
      next: (data) => {
        // Filtramos para mostrar solo tareas que no hayan finalizado (opcional)
        // y asignamos al array
        this.tareasDisponibles = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando tareas', err);
        this.mensaje = 'Error al conectar con el servidor.';
        this.loading = false;
      }
    });
  }

  aplicarTarea(tarea: Tarea): void {
    const trabajadorId = this.authService.getUserId(); 
    
    if (!trabajadorId) {
      alert("Debes iniciar sesión como trabajador para aplicar.");
      this.router.navigate(['/login']);
      return;
    }

    if (!confirm(`¿Estás seguro de querer postularte a la tarea: "${tarea.descripcion}"?`)) {
      return;
    }

    // Construimos el objeto Solicitud basado en TU interfaz
    const nuevaSolicitud: Solicitud = {
      id: 0, // El backend debería generar esto, enviamos 0 por defecto
      fechaSolicitud: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
      aceptado: false, // Por defecto al crearla es false
      trabajadorId: Number(trabajadorId),
      
      // NOTA: Tu modelo Tarea no tiene el ID del cliente explícito como propiedad simple,
      // pero si el backend envía el objeto cliente dentro de tarea, deberías acceder a él.
      // Aquí asumo un valor ficticio o que lo sacas de tarea.cliente.id si existiera.
      clienteId: 0, // <-- OJO: Necesitas saber de quién es la tarea. 
      
      tarea: tarea // Pasamos el objeto tarea completo como pide tu interfaz
    };

    this.solicitudService.create(nuevaSolicitud).subscribe({
      next: (res) => {
        alert('¡Solicitud enviada con éxito!');
        // Opcional: Quitar la tarea de la lista para que no aplique dos veces
        this.tareasDisponibles = this.tareasDisponibles.filter(t => t.id !== tarea.id);
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al enviar la solicitud.');
      }
    });
  }
}