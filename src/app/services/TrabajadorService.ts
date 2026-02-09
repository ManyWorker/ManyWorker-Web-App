import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trabajador } from '../../model/trabajador';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService {
  private url = "http://localhost:8080/trabajador"; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Trabajador[]> {
    return this.http.get<Trabajador[]>(this.url);
  }

  getById(id: number): Observable<Trabajador> {
    return this.http.get<Trabajador>(`${this.url}/${id}`);
  }

  create(trabajador: Trabajador): Observable<Trabajador> {
    return this.http.post<Trabajador>(this.url, trabajador);
  }

  update(id: number, trabajador: Trabajador): Observable<Trabajador> {
    return this.http.put<Trabajador>(`${this.url}/${id}`, trabajador);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}