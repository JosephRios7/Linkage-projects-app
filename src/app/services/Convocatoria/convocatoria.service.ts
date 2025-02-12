import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Importar configuraciones de entorno
import { Convocatoria } from '../../models/convocatoria.model';

@Injectable({
  providedIn: 'root',
})
export class ConvocatoriaService {
  private apiUrl = environment.apiUrl; // URL base de la API, definida en los entornos
  private storageUrl = environment.storageUrl; // URL base para el almacenamiento de archivos

  constructor(private http: HttpClient) {}

  /**
   * Listar convocatorias con paginación, búsqueda y estado opcional
    admin
   */
  listarConvocatorias(
    page: number = 1,
    search: string = '',
    estado: string = ''
  ): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    let params = new HttpParams().set('page', page);
    if (search) {
      params = params.set('search', search);
    }
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get(this.apiUrl, { headers, params });
  }

  /**
   * Publicar una convocatoria admin
   */
  publicarConvocatoria(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/${id}`, {}, { headers });
  }

  //finalizar
  finalizarConvocatoria(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(`${this.apiUrl}/finalizar/${id}`, {}, { headers });
  }

  /**
   * Eliminar una convocatoria **admin**
   */
  eliminarConvocatoria(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Listar convocatorias publicadas profesor
   */
  listarConvocatoriasPublicadas(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/publicadas`, { headers });
  }
  //profesor
  obtenerConvocatoriaPorId(id: number): Observable<Convocatoria> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Convocatoria>(`${this.apiUrl}/${id}`, {
      headers,
    });
  }
  //region proyecto
  //aqui
  //método para guardar un proyecto asociado a una convocatoria ****profesor****
  crearProyecto(formData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json', // Este encabezado sí se puede mantener
    });

    return this.http.post(`${this.apiUrl}/proyectos/formato`, formData, {
      headers,
    });
  }
  obtenerEstadoProyecto(convocatoriaId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/convocatorias/${convocatoriaId}/estado`,
      { headers: this.getAuthHeaders() }
    );
  }

  obtenerDetalleProyecto(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/proyectos/${id}`, { headers });
  }
  obtenerProyectosDelProfesor(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<any>(`${this.apiUrl}/profesor/proyectos`, { headers });
  }
  actualizarProyecto(formData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    // Supongamos que tu backend expone PUT /api/proyectos, recibiendo un formData con proyecto_id
    return this.http.post<any>(`${this.apiUrl}/proyectos/update`, formData, {
      headers,
    });
  }

  obtenerProyectosAprobadosDocente(): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // Llamamos la ruta /profesor/proyectos-aprobados
    return this.http.get<any>(`${this.apiUrl}/profesor/proyectos-aprobados`, {
      headers,
    });
  }
  
  //endregion
  //region convocatoria
  /**
   * Obtener la URL completa de un archivo almacenado
   * @param filePath Ruta relativa del archivo
   * @returns URL completa del archivo
   */
  getFileUrl(filePath: string): string {
    return `${this.storageUrl}/${filePath}`;
  }
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  guardarConvocatoria(data: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}`, data, { headers });
  }

  // editarConvocatoria(id: number, data: FormData): Observable<any> {
  //   const token = localStorage.getItem('access_token');
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //   });

  //   // Asume que la ruta en el backend para actualizar es /convocatorias/{id}
  //   return this.http.post(`${this.apiUrl}/${id}?_method=PUT`, data, {
  //     headers,
  //   });
  // }
  // En tu servicio
  editarConvocatoria(id: number, convocatoriaData: any): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    // Aquí enviamos JSON, no FormData
    return this.http.put(`${this.apiUrl}/${id}`, convocatoriaData, { headers });
  }

  public getConvocatoriaById(id: number): Observable<Convocatoria> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<Convocatoria>(`${this.apiUrl}/obtener/${id}`, {
      headers,
    });
  }
  listarFases(convocatoriaId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(
      `${this.apiUrl}/fase_convocatorias/${convocatoriaId}`,
      {
        headers,
      }
    );
  }
  // src/app/services/Convocatoria/convocatoria.service.ts

  obtenerFaseConvocatoriaPorNombre(
    convocatoriaId: string,
    nombreFase: string
  ): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().set('nombre', nombreFase);
    return this.http.get(
      `${this.apiUrl}/fase_convocatorias/${convocatoriaId}/por_nombre`,
      { headers, params }
    );
  }
  obtenerArchivosFase(faseId: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/archivos/fase/${faseId}`, { headers });
  }
}
