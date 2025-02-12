import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Importar configuraciones de entorno
import { Convocatoria } from '../../models/convocatoria.model';

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {
  private apiUrl = environment.apiUrl; // URL base de la API, definida en los entornos
  private storageUrl = environment.storageUrl; // URL base para el almacenamiento de archivos

  constructor(private http: HttpClient) {}
  //region ARCHIVOS
  // Listar archivos de convocatoria
  listarArchivosConvocatoria(convocatoriaId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(
      `${this.apiUrl}/archivos/convocatoria/${convocatoriaId}`,
      { headers }
    );
  }

  // Listar archivos de fase
  listarArchivosFase(faseId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrl}/archivos/fase/${faseId}`, {
      headers,
    });
  }

  // Descargar archivo de convocatoria
  descargarArchivoConvocatoria(archivoId: number): void {
    window.open(
      `${this.apiUrl}/archivos/convocatoria/${archivoId}/download`,
      '_blank'
    );
  }

  // Descargar archivo de fase
  descargarArchivoFase(archivoId: number): void {
    window.open(
      `${this.apiUrl}/archivos/fase/${archivoId}/download`,
      '_blank'
    );
  }

  // Eliminar archivo de convocatoria
  eliminarArchivoConvocatoria(archivoId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(
      `${this.apiUrl}/archivos/convocatoria/${archivoId}`,
      { headers }
    );
  }

  // Eliminar archivo de fase
  eliminarArchivoFase(archivoId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.delete(`${this.apiUrl}/archivos/fase/${archivoId}`, {
      headers,
    });
  }

  // Subir archivo para convocatoria
  subirArchivoConvocatoria(formData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/archivos/convocatoria`, formData, {
      headers,
    });
  }

  // Subir archivo para fase
  subirArchivoFase(formData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/archivos/fase`, formData, {
      headers,
    });
  }

  //endregion
}
