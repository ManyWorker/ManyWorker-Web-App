import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ActorLogin, AuthResponse } from '../models/actor-login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/actor/login';

  constructor(private http: HttpClient) {}

  login(credentials: ActorLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('username', res.username);
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }
}