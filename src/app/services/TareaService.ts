import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarea } from '../../model/Tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private url = "http://localhost:8080/tareas"; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(this.url);
  }

  getById(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.url}/${id}`);
  }

  create(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(this.url, tarea);
  }

  // Método para guardar tareas que ya tiene solicitudes
  update(id: number, tarea: Tarea): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.url}/${id}`, tarea);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}