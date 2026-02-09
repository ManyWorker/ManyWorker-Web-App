import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8080/categoria'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}