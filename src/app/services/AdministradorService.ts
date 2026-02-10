import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador } from '../../model/administrador';
import { Categoria } from '../../model/Categoria';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = "http://localhost:8080/admin";

  constructor(private http: HttpClient) { }

  // a. Crear cuentas para nuevos administradores
  createAdmin(admin: Administrador): Observable<Administrador> {
    return this.http.post<Administrador>(`${this.url}/register`, admin);
  }

  // b. Gestión del Catálogo de Categorías
  // Nota: La restricción de no borrar si tiene tareas se controla por el error del Backend
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`http://localhost:8080/categoria`);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/categoria/${id}`);
  }

  // c. Transmitir un mensaje Broadcast
  sendBroadcast(asunto: string, cuerpo: string): Observable<void> {
    const mensaje = {
      asunto: asunto,
      cuerpo: cuerpo,
      fechaEnvio: new Date()
      // No lleva destinatario porque es Broadcast
    };
    return this.http.post<void>(`${this.url}/broadcast`, mensaje);
  }
}