import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // URL del backend Laravel

  constructor(private http: HttpClient) {}

  // Método para realizar el login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Método para realizar el logout
  logout(): Observable<any> {
    const token = this.getToken(); // Recuperar el token almacenado
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }

  // Guardar token en localStorage
  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Guardar usuario en localStorage
  setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Obtener token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Obtener usuario desde localStorage
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Eliminar token y usuario de localStorage
  clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || ''; // Devuelve el rol del usuario autenticado
  }
}
