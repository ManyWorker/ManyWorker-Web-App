import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PerfilSocial } from '../../model/PerfilSocial';

@Injectable({
  providedIn: 'root',
})
export class PerfilSocialService {
  private url = "http://localhost:8080/perfilsocial";

  constructor(private http: HttpClient) { }

  getNoticias(): Observable<PerfilSocial[]> {
    return this.http.get<PerfilSocial[]>(this.url);
  }

  getNoticiaById(id: number): Observable<PerfilSocial> {
    return this.http.get<PerfilSocial>(`${this.url}/${id}`);
  }

  saveNoticia(perfilsocial: PerfilSocial): Observable<string> {
    return this.http.post(this.url, perfilsocial, { responseType: 'text' });
  }

  updateNoticia(id: number, perfilsocial: PerfilSocial): Observable<string> {
    return this.http.put(`${this.url}/${id}`, perfilsocial, { responseType: 'text' });
  }

  deleteNoticia(id: number): Observable<string> {
    return this.http.delete(`${this.url}/${id}`, { responseType: 'text' });
  }
}