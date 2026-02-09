import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Administrador } from '../../model/administrador'; // Ajusta la ruta según tu proyecto

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private url = "http://localhost:8080/Administrador"; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Administrador[]> {
    return this.http.get<Administrador[]>(this.url);
  }

  getById(id: number): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.url}/${id}`);
  }

  create(Administrador: Administrador): Observable<Administrador> {
    return this.http.post<Administrador>(this.url, Administrador);
  }

  update(id: number, Administrador: Administrador): Observable<Administrador> {
    return this.http.put<Administrador>(`${this.url}/${id}`, Administrador);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}