import { Component, OnInit } from '@angular/core';
import { ConvocatoriaService } from '../../../../services/Convocatoria/convocatoria.service';
import { Convocatoria } from '../../../../models/convocatoria.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-convocatorias-profe',
  templateUrl: './convocatoriasProfe.component.html',
  imports: [CommonModule, RouterModule],
})
export class ConvocatoriasProfeComponent implements OnInit {
  convocatorias: Convocatoria[] = [];
  errorMessage: string | null = null;

  constructor(private convocatoriaService: ConvocatoriaService) {}

  ngOnInit(): void {
    this.obtenerConvocatoriasPublicadas();
  }

  obtenerConvocatoriasPublicadas(): void {
    this.convocatoriaService.listarConvocatoriasPublicadas().subscribe({
      next: (data: Convocatoria[]) => {
        console.log('Convocatorias publicadas:', data);
        this.convocatorias = data;
        this.errorMessage = null; // Limpia errores si la solicitud es exitosa
      },
      error: (error) => {
        console.error('Error al obtener convocatorias:', error);
        this.errorMessage = 'Error al obtener convocatorias publicadas. Inténtalo nuevamente.';
      },
    });
  }
}
