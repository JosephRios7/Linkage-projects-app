import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'; // Importar configuraciones de entorno
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  private apiUrl = environment.apiUrl; // URL base de la API

  constructor(private http: HttpClient) {}

  /**
   * Listar proyectos relacionados a una convocatoria específica
   * @param idConvocatoria ID de la convocatoria
   */
  listarProyectosPorConvocatoria(idConvocatoria: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(
      `${this.apiUrl}/convocatorias/${idConvocatoria}/proyectos`,
      { headers }
    );
  }
  //usando el servico de proyectos
  obtenerDetalleProyecto(id: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(`${this.apiUrl}/proyectos/${id}`, { headers });
  }

  // Descargar archivo de fase
  descargarArchivoProyecto(archivoId: number): void {
    window.open(
      `${this.apiUrl}/archivos/proyecto/${archivoId}/download`,
      '_blank'
    );
  }

  subirArchivosFase(formData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // No poner 'Content-Type' para permitir multipart/form-data
    });
    return this.http.post<any>(
      `${this.apiUrl}/proyectos/subir-fase`, // Ajusta la ruta
      formData,
      { headers }
    );
  }

  /***********************************************************************************
   * Aprobar un proyecto y asignar código y número de resolución (ADMIN/REVISOR)
   * @param idProyecto ID del proyecto
   * @param datosAprobacion Código de proyecto y número de resolución
   */
  // aprobarProyecto(
  //   idProyecto: number,
  //   datosAprobacion: { codigo_proyecto: string; numero_resolucion: string }
  // ): Observable<any> {
  //   return this.http.post(
  //     `${this.apiUrl}/proyectos/${idProyecto}/aprobar`,
  //     datosAprobacion,
  //     { headers: this.getAuthHeaders() }
  //   );
  // }

  /**
   * Aprobar proyecto en Fase1 (requiere código_proyecto y numero_resolucion)
   */
  // ↪ Para aprobar en Fase 1 (requiere código y resolución)
  aprobarFase1(
    idProyecto: number,
    datosAprobacion: { codigo_proyecto: string; numero_resolucion: string }
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/proyectos/${idProyecto}/aprobar-fase1`,
      datosAprobacion,
      { headers: this.getAuthHeaders() }
    );
  }

  // ↪ Para aprobar en Fase 2 o Fase 3 (no requiere código/resolución)
  aprobarFaseSiguiente(idProyecto: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/proyectos/${idProyecto}/aprobar-fase-siguiente`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  /**
   * Enviar un proyecto a correcciones (ADMIN/REVISOR)
   * @param idProyecto ID del proyecto
   */
  enviarProyectoACorreccion(idProyecto: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/proyectos/${idProyecto}/correcciones`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  enviarObservacion(formData: FormData): Observable<any> {
    // Para evitar que se sobreescriba el Content-Type, creamos headers sin "Content-Type"
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      // No se incluye 'Content-Type' para permitir que el navegador lo configure
    });
    return this.http.post<any>(
      `${this.apiUrl}/proyectos/observaciones`,
      formData,
      { headers }
    );
  }
  // proyectos.service.ts (ejemplo)
  getObservacionesProyecto(proyectoId: number): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(
      `${this.apiUrl}/proyectos/${proyectoId}/observaciones`,
      { headers }
    );
  }

  /**
   * Obtener acceso a la siguiente fase (DOCENTE)
   * @param idProyecto ID del proyecto
   */
  // accederSiguienteFase(idProyecto: number): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/proyectos/siguiente/${idProyecto}`, {
  //     headers: this.getAuthHeaders(),
  //   });
  // }

  /**
   * Obtener headers con autenticación
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
}
