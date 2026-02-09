import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080'; // Tu base URL

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/actor/login`, credentials).pipe(
      // Usamos 'tap' para realizar efectos secundarios (guardar datos) sin alterar el flujo
      tap((response: any) => {
        if (response.token) {
          // 1. Guardar el Token (para el interceptor)
          sessionStorage.setItem('token', response.token);

          // 2. Guardar los datos del usuario (para el perfil)
          const usuarioData = {
            id: response.id,
            username: response.username,
            rol: response.rol,
          };

          // Lo guardamos como string JSON
          sessionStorage.setItem('usuario', JSON.stringify(usuarioData));
        }
      }),
    );
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

  logout(): void {
    // Borramos el token JWT
    sessionStorage.removeItem('token');
    
    // Borramos los datos del usuario (id, nombre, rol)
    sessionStorage.removeItem('usuario');
    
    // Opcional: Si quieres asegurarte de borrar TODO lo de la sesión:
    // sessionStorage.clear(); 
  }

  hasRole(role: string): boolean {
  const userString = sessionStorage.getItem('usuario');
  if (!userString) return false;
  
  try {
    const user = JSON.parse(userString);
    // Compara el rol guardado (asegúrate que en el login guardaste "CLIENTE", "ADMINISTRADOR", etc.)
    return user.rol === role;
  } catch (e) {
    return false;
  }
}
}
