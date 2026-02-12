// tutorial.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  private apiUrl = 'http://localhost:8080/tutoriales'; 

  constructor(private http: HttpClient) {}

  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  findById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  findByAutorId(autorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/autor/${autorId}`);
  }

  /**
   * Crear tutorial: 
   * No enviamos el autor porque el Backend lo extrae del JWT por seguridad.
   */
  create(tutorial: { titulo: string; resumen: string; texto: string; imagenes?: string[] }): Observable<any> {
    // El interceptor añadirá el "Authorization: Bearer <token>" automáticamente
    return this.http.post<any>(this.apiUrl, tutorial);
  }

  update(id: number, tutorial: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tutorial);
  }

  /**
   * Eliminar tutorial:
   * Especificamos responseType 'text' porque el backend devuelve un String de confirmación, 
   * no un objeto JSON, lo que evitaría errores de parseo en Angular.
   */
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}