import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavigationStateService } from '../../../../services/navigation-state.service';
import { ConvocatoriaService } from '../../../../services/Convocatoria/convocatoria.service';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';

// Modelos (ajusta si fuera necesario)
import { Convocatoria } from '../../../../models/convocatoria.model';

@Component({
  selector: 'app-proyecto-fase2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyecto-fase2.component.html',
  styleUrls: ['./proyecto-fase2.component.css'],
})
export class ProyectoFase2Component implements OnInit, OnDestroy {
  convocatoria: Convocatoria | null = null;

  // Archivos globales de la Fase2 (Avance de Proyectos)
  archivosFase2: any[] = [];

  // Lista de proyectos del docente en Fase2 o Fase3
  proyectosFase2y3: any[] = [];

  // Modal para ver documentos de un proyecto
  modalVerDocsVisible: boolean = false;
  proyectoConDocumentos: any = null;
  documentosProyecto: any[] = [];

  // Modal para ver observaciones de un proyecto
  modalObservacionesVisible: boolean = false;
  proyectoConObservaciones: any = null;
  observaciones: any[] = [];

  // Modal para subir archivos al proyecto en Fase2
  modalSubidaVisible: boolean = false;
  proyectoEnSubida: any = null; // El proyecto en el que subiremos archivos
  archivosSeleccionados: File[] = [];

  // Modal de confirmación de subida
  modalConfirmVisible: boolean = false;

  // Para mostrar mensajes/errores
  showToast: boolean = false;
  toastMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private navigationStateService: NavigationStateService,
    private convocatoriaService: ConvocatoriaService,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la convocatoria desde la URL (si hace falta)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.navigationStateService.setConvocatoriaId(id);
      // Podrías usarlo para cargar la convocatoria o la fase, por ejemplo:
      this.cargarArchivosFase2(id);
    }

    // Cargar la lista de proyectos en Fase2/Fase3
    this.cargarProyectosFase2y3();
  }

  ngOnDestroy(): void {
    this.navigationStateService.setConvocatoriaId(null);
  }

  /**
   * Carga los archivos de la fase "Avance de Proyectos de Vinculación" (Fase2) a nivel global
   * @param convocatoriaId ID de la convocatoria
   */
  cargarArchivosFase2(convocatoriaId: string): void {
    // Ajusta según tu servicio:
    this.convocatoriaService
      .obtenerFaseConvocatoriaPorNombre(
        convocatoriaId,
        'Avance de Proyectos de Vinculación'
      )
      .subscribe({
        next: (faseData) => {
          const faseId = faseData.id;
          // Llamar a tu método que lista archivos de la fase
          this.convocatoriaService.obtenerArchivosFase(faseId).subscribe({
            next: (archivos) => {
              this.archivosFase2 = archivos;
            },
            error: (err) => {
              console.error('Error al cargar archivos de Fase2:', err);
            },
          });
        },
        error: (err) => {
          console.error('Error al obtener Fase2:', err);
        },
      });
  }

  /**
   * Carga los proyectos del docente que estén en Fase2 o Fase3
   */
  cargarProyectosFase2y3(): void {
    // Podrías reutilizar tu "obtenerProyectosDelProfesor" y filtrar
    // o crear un nuevo método en el backend que ya devuelva solo Fase2/Fase3.
    this.convocatoriaService.obtenerProyectosDelProfesor().subscribe({
      next: (resp) => {
        // Filtrar en TS (si el backend no los filtra directamente)
        this.proyectosFase2y3 = resp.proyectos.filter(
          (p: any) => p.fase === 'Fase2' || p.fase === 'Fase3'
        );
      },
      error: (err) => {
        console.error('Error al cargar proyectos Fase2/Fase3:', err);
      },
    });
  }

  /**
   * Descargar uno de los archivos de la fase2 global
   */
  descargarArchivoFase2(archivo: any): void {
    // archivo.file_data es la cadena en base64
    // archivo.mime_type es, por ejemplo, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // archivo.titulo es el nombre original

    // Decodificar base64 a binario
    const byteCharacters = atob(archivo.file_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Crear Blob
    const blob = new Blob([byteArray], { type: archivo.mime_type });

    // Crear URL de descarga
    const blobUrl = URL.createObjectURL(blob);

    // Crear elemento <a> y simular clic para descargar
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = archivo.titulo;
    a.click();

    // Liberar URL
    URL.revokeObjectURL(blobUrl);
  }

  /**
   * Ver documentos de un proyecto (abre modalVerDocsVisible)
   */
  verDocumentosProyecto(proyecto: any): void {
    this.proyectoConDocumentos = proyecto;
    this.documentosProyecto = []; // Limpia la lista
    this.modalVerDocsVisible = true;

    // Llama a un servicio que retorne los archivos del proyecto
    this.proyectosService.obtenerDetalleProyecto(proyecto.id).subscribe({
      next: (resp) => {
        // Filtra archivos (p.e. si sólo quieres fase actual)
        this.documentosProyecto = resp.proyecto.archivos || [];
      },
      error: (err) => {
        console.error('Error al obtener documentos del proyecto:', err);
      },
    });
  }

  cerrarModalVerDocs(): void {
    this.modalVerDocsVisible = false;
    this.proyectoConDocumentos = null;
    this.documentosProyecto = [];
  }

  descargarDocumentoProyecto(archivo: any): void {
    // archivo.file_data es la cadena en base64
    // archivo.mime_type es, por ejemplo, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // archivo.titulo es el nombre original

    // Decodificar base64 a binario
    const byteCharacters = atob(archivo.file_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Crear Blob
    const blob = new Blob([byteArray], { type: archivo.mime_type });

    // Crear URL de descarga
    const blobUrl = URL.createObjectURL(blob);

    // Crear elemento <a> y simular clic para descargar
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = archivo.titulo;
    a.click();

    // Liberar URL
    URL.revokeObjectURL(blobUrl);
  }

  /**
   * Ver Observaciones de un proyecto
   */
  verObservaciones(proyecto: any): void {
    this.proyectoConObservaciones = proyecto;
    this.proyectosService.getObservacionesProyecto(proyecto.id).subscribe({
      next: (response) => {
        // Ajusta según la estructura de tu respuesta
        this.observaciones = response.observaciones || [];
        this.modalObservacionesVisible = true;
      },
      error: (err) => {
        console.error('Error al obtener observaciones:', err);
        this.mostrarToast(
          '❌ Error al obtener observaciones del proyecto.',
          false
        );
      },
    });
  }

  cerrarModalObservaciones(): void {
    this.modalObservacionesVisible = false;
    this.observaciones = [];
    this.proyectoConObservaciones = null;
  }

  /**
   * Abrir modal para subir archivos a un proyecto en Fase2
   */
  abrirModalSubida(proyecto: any): void {
    this.proyectoEnSubida = proyecto;
    this.archivosSeleccionados = [];
    this.modalSubidaVisible = true;
  }

  cerrarModalSubida(): void {
    this.modalSubidaVisible = false;
    this.proyectoEnSubida = null;
    this.archivosSeleccionados = [];
  }

  /**
   * Maneja la selección de archivos para subir
   */
  handleFileSelect(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.archivosSeleccionados = Array.from(event.target.files);
    }
  }

  /**
   * Confirmar la subida (muestra modal de confirmación)
   */
  confirmarSubida(): void {
    // Antes de enviar, mostramos un modal de confirmación
    if (this.archivosSeleccionados.length === 0) {
      this.mostrarToast('No has seleccionado archivos.', false);
      return;
    }
    this.modalConfirmVisible = true;
  }

  /**
   * Cancelar la confirmación y regresar al modal de subida
   */
  cancelarConfirmacion(): void {
    this.modalConfirmVisible = false;
  }

  /**
   * Enviar definitivamente los archivos al backend para la Fase2
   */
  enviarArchivosFase2(): void {
    // Cierra los modales
    this.modalConfirmVisible = false;
    this.modalSubidaVisible = false;

    // Construye un FormData con 'fase' = 'Fase2', etc.
    const formData = new FormData();
    formData.append('proyecto_id', this.proyectoEnSubida.id);
    formData.append('fase', 'Fase2'); // Para que el backend sepa que es la Fase2

    this.archivosSeleccionados.forEach((file) => {
      formData.append('archivos[]', file, file.name);
    });

    // Llamar a tu servicio para subir:
    this.proyectosService.subirArchivosFase(formData).subscribe({
      next: () => {
        this.mostrarToast('Archivos subidos correctamente.', true);
        this.proyectoEnSubida = null;
        this.archivosSeleccionados = [];
        // Re-cargar la lista de proyectos o los documentos...
        this.cargarProyectosFase2y3();
      },
      error: (err) => {
        console.error('Error al subir archivos Fase2:', err);
        this.mostrarToast('Error al subir archivos.', false);
      },
    });
  }

  /**
   * Muestra toast
   */
  mostrarToast(mensaje: string, exito: boolean): void {
    this.toastMessage = mensaje;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}


