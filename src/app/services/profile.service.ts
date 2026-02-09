import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { UserProfile } from '../../model/userProfile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080'; // Ajusta a tu puerto

  constructor(private http: HttpClient) {}

  // Obtiene el perfil según el rol y el ID guardados en el token/sessionStorage
  getProfile(role: string, id: number): Observable<UserProfile> {
    const endpoint = this.getEndpointByRole(role);
    return this.http.get<UserProfile>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  // Actualiza el perfil
  updateProfile(role: string, id: number, data: UserProfile): Observable<any> {
    const endpoint = this.getEndpointByRole(role);
    
    // Añadimos el objeto de opciones como tercer argumento
    return this.http.put(
        `${this.baseUrl}/${endpoint}/${id}`, 
        data, 
        { responseType: 'text' as 'json' } // Truco para que TS no se queje pero Angular lo trate como texto
    ); 
  }

  // Helper para determinar la URL base según el rol
  private getEndpointByRole(role: string): string {
    switch (role?.toUpperCase()) {
      case 'ADMINISTRADOR': return 'admin';
      case 'TRABAJADOR': return 'trabajador';
      case 'CLIENTE': return 'cliente';
      default: throw new Error('Rol no reconocido');
    }
  }
}