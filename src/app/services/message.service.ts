// src/app/services/message.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnviarMensajeDTO, Mensaje } from '../../model/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private apiUrl = 'http://localhost:8080/mensajes';

  constructor(private http: HttpClient) { }

  // Obtener Bandeja de Entrada (Recibidos)
  getInbox(userId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/destinatario/${userId}`);
  }

  // Obtener Bandeja de Salida (Enviados)
  getSent(userId: number): Observable<Mensaje[]> {
    return this.http.get<Mensaje[]>(`${this.apiUrl}/remitente/${userId}`);
  }

  // Enviar mensaje nuevo (Usa el DTO con username)
  sendMessage(data: EnviarMensajeDTO): Observable<Mensaje> {
    return this.http.post<Mensaje>(`${this.apiUrl}/enviar`, data);
  }

  // Eliminar mensaje
  // IMPORTANTE: Ponemos responseType: 'text' porque tu backend devuelve un String, no un JSON.
  deleteMessage(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}