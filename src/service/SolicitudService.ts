import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../model/Solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private url = "http://localhost:8080/solicitud";

  constructor(private http: HttpClient) { }

  getAll(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.url);
  }

  getById(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.url}/${id}`);
  }

  create(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(this.url, solicitud);
  }

  // Ejemplo de método específico (aceptar solicitud)
  aceptar(id: number): Observable<any> {
    return this.http.put(`${this.url}/${id}/aceptar`, {});
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}