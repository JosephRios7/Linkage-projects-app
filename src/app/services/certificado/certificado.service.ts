import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificadoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getProyectos(): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any[]>(`${this.apiUrl}/convocatorias/proyectos`, {
      headers,
    });
  }

  // Obtener la cantidad de estudiantes y docentes en un proyecto con autenticación
  obtenerParticipantes(proyectoId: number) {
    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get(
      `${this.apiUrl}/proyecto/${proyectoId}/participantes`,
      { headers }
    );
  }

  // Descargar el certificado del estudiante
  descargarCertificado(proyectoId: number, estudianteId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    });

    return this.http.get(
      `${this.apiUrl}/certificado/${proyectoId}/${estudianteId}`,
      {
        headers,
        responseType: 'blob',
      }
    );
  }
  // Este método consulta los certificados del docente autenticado
  getCertificadosPorDocente(userId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/certificados/docente/${userId}`, {
      headers,
    });
  }
  // Método para obtener certificados para estudiantes
  getCertificadosPorEstudiante(userId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/certificados/estudiante/${userId}`, {
      headers,
    });
  }
}
