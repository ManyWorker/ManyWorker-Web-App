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

  // Crear tutorial: el backend asigna el autor automáticamente desde el token JWT
  create(tutorial: { titulo: string; resumen: string; texto: string; imagenes?: string[] }): Observable<any> {
    return this.http.post<any>(this.apiUrl, tutorial);
  }

  update(id: number, tutorial: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tutorial);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' as 'json' });
  }
}