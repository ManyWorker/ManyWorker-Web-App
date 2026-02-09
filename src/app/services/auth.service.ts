import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080'; // Tu base URL

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/actor/login`, credentials);
  }

  // MODIFICADO: Decide el endpoint según el rol
  register(userData: any): Observable<any> {
  if (userData.rol === 'TRABAJADOR') {
    // Añadimos { responseType: 'text' }
    return this.http.post(`${this.baseUrl}/trabajador`, userData, { responseType: 'text' });
  } else {
    return this.http.post(`${this.baseUrl}/cliente`, userData, { responseType: 'text' }); // Asumiendo lo mismo para cliente
  }
}
}