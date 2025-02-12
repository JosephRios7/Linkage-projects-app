import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvocatoriaService } from '../../../../../services/Convocatoria/convocatoria.service';
import { ArchivoService } from '../../../../../services/ConvocatoriaArchivoService/archivo.service';
import {
  Convocatoria,
  Archivo,
} from '../../../../../models/convocatoria.model';
import { NavigationStateService } from '../../../../../services/navigation-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-convocatoria-archivos',
  templateUrl: './convocatoria-archivos.component.html',
  styleUrls: ['./convocatoria-archivos.component.css'],
  imports: [CommonModule],
})
export class ConvocatoriaArchivosComponent implements OnInit, OnDestroy {
  convocatoria: Convocatoria | null = null; // Información de la convocatoria
  // Archivos de la convocatoria
  archivosConvocatoria: Archivo[] = [];
  // Array de fases; cada fase incluirá su propiedad "archivos"
  fases: any[] = [];
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private convocatoriaService: ConvocatoriaService,
    private archivoService: ArchivoService,
    private navigationStateService: NavigationStateService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log('ID obtenido desde la URL:', id);
      this.navigationStateService.setConvocatoriaId(id);
      this.obtenerConvocatoriaConArchivos(id);
    }
  }

  obtenerConvocatoriaConArchivos(id: string): void {
    this.convocatoriaService.obtenerConvocatoriaPorId(+id).subscribe({
      next: (data: Convocatoria) => {
        console.log('Datos de la convocatoria recibidos:', data);
        this.convocatoria = data;
        // Si la respuesta trae archivos (de convocatoria) los asignamos
        this.archivosConvocatoria = data.archivos || [];
        // Luego, cargamos las fases consultando el endpoint (sin depender de data.fases)
        this.cargarFases(data.id!);
      },
      error: (error) => {
        console.error('Error al cargar la convocatoria:', error);
        this.errorMessage = 'Error al cargar la convocatoria y sus archivos.';
      },
    });
  }

  cargarFases(convocatoriaId: number): void {
    this.convocatoriaService.listarFases(convocatoriaId).subscribe({
      next: (fasesData) => {
        this.fases = fasesData; // Asignamos las fases obtenidas del endpoint
        // Para cada fase, cargar sus archivos (solo si fase.id existe)
        this.fases.forEach((fase: any, index: number) => {
          if (fase.id !== undefined && fase.id !== null) {
            this.archivoService.listarArchivosFase(fase.id).subscribe({
              next: (files) => {
                this.fases[index].archivos = files;
              },
              error: (err) =>
                console.error(
                  `Error al cargar archivos para la fase ${fase.id}:`,
                  err
                ),
            });
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar fases:', err);
      },
    });
  }

  // Método para descargar archivos de convocatoria
  descargarArchivoConv(archivoId: number): void {
    this.archivoService.descargarArchivoConvocatoria(archivoId);
  }

  // Método para descargar archivos de fase
  descargarArchivoFase(archivoId: number): void {
    this.archivoService.descargarArchivoFase(archivoId);
  }

  ngOnDestroy(): void {
    this.navigationStateService.setConvocatoriaId(null);
  }
}
