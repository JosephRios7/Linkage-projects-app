import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected apiUrl = 'http://127.0.0.1:8000/api';

  constructor(protected http: HttpClient) {}

  // Método para obtener los encabezados
  protected getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Métodos comunes para solicitudes
  protected get<T>(endpoint: string) {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  protected post<T>(endpoint: string, data: any) {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  protected put<T>(endpoint: string, data: any) {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  protected delete<T>(endpoint: string) {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    });
  }
}
