import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  // Ruta definida en TutorialController.java
  private apiUrl = 'http://localhost:8080/tutoriales'; 

  constructor(private http: HttpClient) {}

  findAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(this.apiUrl);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}