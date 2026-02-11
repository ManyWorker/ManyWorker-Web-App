import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../../model/Categoria';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private adminUrl = 'http://localhost:8080/admin';
  private categoriaUrl = 'http://localhost:8080/categoria';
  private mensajesUrl = 'http://localhost:8080/mensajes';

  constructor(private http: HttpClient) {}

  // a. Crear cuentas para nuevos administradores
  // FIX: El endpoint correcto es POST /admin (no /admin/register)
  createAdmin(admin: any): Observable<any> {
    return this.http.post(`${this.adminUrl}`, admin, { responseType: 'text' as 'json' });
  }

  // b. Gestión del Catálogo de Categorías
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriaUrl);
  }

  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.categoriaUrl}/${id}`, { responseType: 'text' as 'json' });
  }

  // c. Transmitir un mensaje Broadcast
  // FIX: El endpoint correcto es POST /mensajes/broadcast (no /admin/broadcast)
  // Solo enviamos asunto y cuerpo; el remitente se obtiene del token en el backend
  sendBroadcast(asunto: string, cuerpo: string): Observable<any> {
    const body = { asunto, cuerpo };
    return this.http.post(`${this.mensajesUrl}/broadcast`, body);
  }
}
