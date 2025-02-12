import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriapublicadaService {
  private apiUrl = environment.apiUrl; // Utiliza la URL base desde el entorno

  constructor(private http: HttpClient) {}

  // Método para obtener convocatorias publicadas
  getPublicadas() {
    return this.http.get(`${this.apiUrl}/publicadas`);
  }
} 
