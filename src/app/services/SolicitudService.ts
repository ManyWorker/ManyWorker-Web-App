import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitud } from '../../model/Solicitud';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  private url = "http://localhost:8080/solicitudes";

  constructor(private http: HttpClient) { }

  // Función para obtener el token y armar la cabecera (Evita el error 403)
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); // O de donde saques tu token
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAll(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(this.url);
  }

  getById(id: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.url}/${id}`);
  }

  // APLICAMOS LA CABECERA AQUÍ PARA EVITAR EL 403 FORBIDDEN
  create(solicitud: Solicitud): Observable<any> {
    return this.http.post(this.url, solicitud, { 
      headers: this.getHeaders(), 
      responseType: 'text' as 'json' // Mantenemos text porque tu Java devuelve un String
    });
  }

  aceptar(id: number): Observable<any> {
    const body = { id: id };
    return this.http.put(`${this.url}/aceptar`, body, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }

  rechazar(id: number): Observable<any> {
    const body = { id: id };
    return this.http.put(`${this.url}/rechazar`, body, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }
  
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`, { headers: this.getHeaders(), responseType: 'text' as 'json' });
  }

  getMisSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.url}/trabajador`, { headers: this.getHeaders() });   
  }
}