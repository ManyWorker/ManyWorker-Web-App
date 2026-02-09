import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { Router } from '@angular/router';
import { EnviarMensajeDTO, Mensaje } from '../../../model/message.model';

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mensajes.html',
  styleUrls: ['./mensajes.css']
})
export class Mensajes implements OnInit {
  
  // Estado de la vista
  activeTab: 'inbox' | 'sent' | 'compose' = 'inbox';
  isLoading = false;
  
  // Listas de mensajes
  inboxMessages: Mensaje[] = [];
  sentMessages: Mensaje[] = [];
  
  // Objeto para formulario de envío
  newMessage: EnviarMensajeDTO = {
    usernameDestinatario: '',
    asunto: '',
    cuerpo: ''
  };

  // Feedback
  successMsg = '';
  errorMsg = '';

  // Usuario actual
  currentUserId: number | null = null;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private cd: ChangeDetectorRef // Inyectamos el detector de cambios
  ) {}

  ngOnInit(): void {
    const userString = sessionStorage.getItem('usuario');
    if (userString) {
      const user = JSON.parse(userString);
      this.currentUserId = user.id;
      this.loadInbox(); 
    } else {
      this.router.navigate(['/login']);
    }
  }

  // --- CAMBIO DE PESTAÑAS ---
  switchTab(tab: 'inbox' | 'sent' | 'compose'): void {
    this.activeTab = tab;
    this.successMsg = '';
    this.errorMsg = '';
    
    if (tab === 'inbox') this.loadInbox();
    if (tab === 'sent') this.loadSent();
  }

  // --- CARGA DE DATOS ---
  loadInbox(): void {
    if (!this.currentUserId) return;
    this.isLoading = true;
    this.cd.detectChanges(); // Forzamos vista carga

    this.messageService.getInbox(this.currentUserId).subscribe({
      next: (data) => {
        this.inboxMessages = data || []; 
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.inboxMessages = []; 
        this.isLoading = false;
        this.cd.detectChanges(); // IMPORTANTE: Forzar actualización
      }
    });
  }

  loadSent(): void {
    if (!this.currentUserId) return;
    this.isLoading = true;
    this.cd.detectChanges();

    this.messageService.getSent(this.currentUserId).subscribe({
      next: (data) => {
        this.sentMessages = data || [];
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.sentMessages = [];
        this.isLoading = false;
        this.cd.detectChanges(); // IMPORTANTE: Forzar actualización
      }
    });
  }

  // --- ACCIONES ---
  onSend(): void {
    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';
    this.cd.detectChanges(); // Mostrar spinner inmediatamente

    this.messageService.sendMessage(this.newMessage).subscribe({
      next: (resp) => {
        // ÉXITO
        this.successMsg = 'Mensaje enviado correctamente a ' + this.newMessage.usernameDestinatario;
        this.newMessage = { usernameDestinatario: '', asunto: '', cuerpo: '' }; 
        
        this.isLoading = false; // Parar carga
        this.switchTab('sent'); // Cambiar pestaña
        this.cd.detectChanges(); // Actualizar vista
      },
      error: (err) => {
        // ERROR
        console.error('Error al enviar:', err);
        this.isLoading = false; // 1. PARAR CARGA SIEMPRE

        // 2. Extraer el mensaje de error correctamente
        // Spring Boot a veces devuelve un objeto JSON en el error (no solo texto)
        if (err.error && typeof err.error === 'object') {
            // Intenta leer el campo 'message' o 'error' del JSON
            this.errorMsg = err.error.message || err.error.error || 'Error desconocido al enviar.';
        } else if (typeof err.error === 'string') {
            // Si es texto plano
            this.errorMsg = err.error;
        } else {
            // Fallback
            this.errorMsg = 'No se pudo encontrar al usuario o hubo un error de servidor.';
        }

        // 3. NO cambiamos de pestaña (nos quedamos en compose para que corrija)
        
        // 4. IMPORTANTE: Forzar a Angular a repintar la vista para quitar el spinner
        this.cd.detectChanges(); 
      }
    });
  }

  onDelete(id: number): void {
    if(!confirm('¿Estás seguro de eliminar este mensaje?')) return;

    // Opcional: poner loading aquí también si quieres
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this.inboxMessages = this.inboxMessages.filter(m => m.id !== id);
        this.sentMessages = this.sentMessages.filter(m => m.id !== id);
        this.successMsg = 'Mensaje eliminado.';
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMsg = 'No se pudo eliminar el mensaje.';
        this.cd.detectChanges();
      }
    });
  }
}