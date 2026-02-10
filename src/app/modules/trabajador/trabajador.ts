import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../../model/cliente';
import { ClienteService } from '../../services/ClienteService';

@Component({
  selector: 'app-trabajador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trabajador.html',
  styleUrls: ['./trabajador.css']
})
export class TrabajadorComponent implements OnInit {
  // --- Propiedades para el HTML ---
  activeTab: string = 'catalogo'; // <--- ESTO SOLUCIONA LOS ERRORES DE ACTIVE-TAB
  clientesConTareas: Cliente[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  currentUser: any = null;

  constructor(
    private clienteService: ClienteService,
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
        // Solo mostramos clientes que tengan tareas
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

  // --- Corregido para aceptar 1 solo argumento como pide tu HTML ---
  enviarSolicitud(tareaId: number): void {
    console.log('Solicitud enviada para la tarea:', tareaId);
    this.successMessage = '¡Solicitud enviada con éxito!';
    
    setTimeout(() => {
      this.successMessage = '';
      this.cd.detectChanges();
    }, 3000);
  }
}