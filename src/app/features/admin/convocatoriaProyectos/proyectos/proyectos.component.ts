import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class ProyectosComponent implements OnInit {
  idConvocatoria: number = 0;
  convocatoriaTitulo: string = '';
  proyectos: any[] = [];

  // Variables para el modal de aprobación
  modalVisible: boolean = false;
  proyectoSeleccionado: any;
  codigoProyecto: string = '';
  numeroResolucion: string = '';

  // Variables para el panel de observación de corrección
  panelObservacionVisible: boolean = false;
  observacionComentario: string = '';
  observacionArchivo: File | null = null;
  proyectoACorregir: any = null;

  // Toast de notificación
  showToast: boolean = false;
  toastMessage: string = '';
  observacionArchivos: File[] = [];

  constructor(
    private route: ActivatedRoute,
    private proyectosService: ProyectosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.idConvocatoria = +this.route.snapshot.paramMap.get('id')!;
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.proyectosService
      .listarProyectosPorConvocatoria(this.idConvocatoria)
      .subscribe({
        next: (response) => {
          this.convocatoriaTitulo = response.convocatoria;
          this.proyectos = response.proyectos;
        },
        error: (err) => {
          console.error('Error al cargar proyectos:', err);
        },
      });
  }
  searchTerm: string = '';
  refrescarProyectos(): void {
    // Aquí puedes recargar la lista desde el servidor
    this.cargarProyectos();
    // Opcionalmente, limpiar el campo de búsqueda:
    // this.searchTerm = '';
  }

  // Propiedad computada para filtrar los proyectos
  get filteredProyectos(): any[] {
    if (!this.searchTerm) {
      return this.proyectos;
    }
    const term = this.searchTerm.toLowerCase();
    return this.proyectos.filter(
      (proyecto) =>
        proyecto.estado.toLowerCase().includes(term) ||
        proyecto.nombre.toLowerCase().includes(term) ||
        proyecto.carrera.toLowerCase().includes(term) ||
        (proyecto.fasePresentacion &&
          proyecto.fasePresentacion.toLowerCase().includes(term)) ||
        proyecto.modalidad.toLowerCase().includes(term)
      // Agrega más campos si es necesario
    );
  }

  /**
   * Abre la ventana modal para aprobar un proyecto
   */
  abrirModal(proyecto: any): void {
    this.proyectoSeleccionado = proyecto;
    this.codigoProyecto = '';
    this.numeroResolucion = '';
    this.modalVisible = true;
  }

  /**
   * Cierra la ventana modal de aprobación sin realizar acción
   */
  cerrarModal(): void {
    this.modalVisible = false;
    this.proyectoSeleccionado = null;
    this.codigoProyecto = '';
    this.numeroResolucion = '';
  }

  /**
   * Muestra un toast de notificación
   */
  mostrarToast(mensaje: string): void {
    this.toastMessage = mensaje;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  /**
   * Aprobar el proyecto con código y resolución
   */
  // aprobarProyecto(): void {
  //   if (!this.codigoProyecto || !this.numeroResolucion) {
  //     this.mostrarToast(
  //       '❌ Debe ingresar el código del proyecto y la resolución.'
  //     );
  //     return;
  //   }

  //   const datosAprobacion = {
  //     codigo_proyecto: this.codigoProyecto,
  //     numero_resolucion: this.numeroResolucion,
  //   };

  //   this.proyectosService
  //     .aprobarProyecto(this.proyectoSeleccionado.id, datosAprobacion)
  //     .subscribe({
  //       next: () => {
  //         this.proyectoSeleccionado.estado = 'aprobado';
  //         this.proyectoSeleccionado.codigo_proyecto = this.codigoProyecto;
  //         this.proyectoSeleccionado.numero_resolucion = this.numeroResolucion;
  //         this.cerrarModal();
  //         this.mostrarToast('Proyecto aprobado correctamente.');
  //       },
  //       error: () => {
  //         this.mostrarToast('❌ Error al aprobar el proyecto.');
  //       },
  //     });
  // }
  aprobarProyecto(): void {
    if (!this.codigoProyecto || !this.numeroResolucion) {
      this.mostrarToast(
        '❌ Debe ingresar el código del proyecto y la resolución.'
      );
      return;
    }

    const datosAprobacion = {
      codigo_proyecto: this.codigoProyecto,
      numero_resolucion: this.numeroResolucion,
    };

    // Llamamos al método para Fase1
    this.proyectosService
      .aprobarFase1(this.proyectoSeleccionado.id, datosAprobacion)
      .subscribe({
        next: () => {
          // Por ejemplo, actualiza estado en tu array local
          this.proyectoSeleccionado.estado = 'aprobado';
          this.proyectoSeleccionado.codigo_proyecto = this.codigoProyecto;
          this.proyectoSeleccionado.numero_resolucion = this.numeroResolucion;
          this.cerrarModal();
          this.mostrarToast(
            'Proyecto aprobado correctamente (Fase Presentación).'
          );
          this.cdr.detectChanges();
          // Si deseas, recargar la lista:
          // this.cargarProyectos();
        },
        error: () => {
          this.mostrarToast('❌ Error al aprobar el proyecto.');
        },
      });
  }

  aprobarFaseSiguiente(proyecto: any): void {
    this.proyectosService.aprobarFaseSiguiente(proyecto.id).subscribe({
      next: () => {
        // Actualiza estado/fase localmente si gustas
        proyecto.estado = 'aprobado'; // si tu backend te lo retorna
        // Por ejemplo, recargar lista
        this.cargarProyectos();
        this.mostrarToast('Proyecto aprobado (FaseSiguiente).');
        this.cdr.detectChanges();
      },
      error: () => {
        this.mostrarToast('❌ Error al aprobar la fase siguiente.');
      },
    });
  }

  /**
   * Al hacer clic en "Corregir", se abre el panel para ingresar la observación y adjuntar archivo Word.
   */
  enviarCorreccion(proyecto: any): void {
    this.proyectoACorregir = proyecto;
    this.panelObservacionVisible = true;
  }

  /**
   * Maneja la selección del archivo en el panel de observación, validando que sea Word (.doc o .docx)
   */
  // handleObservacionFileInput(event: any): void {
  //   if (event.target.files && event.target.files[0]) {
  //     const file: File = event.target.files[0];
  //     const allowedTypes = [
  //       'application/msword',
  //       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  //     ];
  //     if (!allowedTypes.includes(file.type)) {
  //       this.mostrarToast('❌ Solo se permiten archivos Word (.doc, .docx).');
  //       event.target.value = null;
  //       this.observacionArchivo = null;
  //       return;
  //     }
  //     this.observacionArchivo = file;
  //   }
  // }
  handleObservacionFileInput(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      // Convertimos FileList a Array
      const selectedFiles: FileList = event.target.files;
      const allowedTypes = [
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      // Vaciamos el arreglo antes de agregar nuevos (o podrías concatenar si quisieras permitir múltiples selecciones sucesivas).
      this.observacionArchivos = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        if (!allowedTypes.includes(file.type)) {
          this.mostrarToast('❌ Solo se permiten archivos Word (.doc, .docx).');
          // Opcional: limpiar input si hay un archivo no válido
          event.target.value = null;
          this.observacionArchivos = [];
          return;
        }
        this.observacionArchivos.push(file);
      }
    }
  }

  /**
   * Cancela el panel de observación y limpia sus variables
   */
  cancelarObservacion(): void {
    this.panelObservacionVisible = false;
    this.observacionComentario = '';
    this.observacionArchivo = null;
    this.proyectoACorregir = null;
  }

  /**
   * Envía la observación general y, si existe, el archivo Word asociado a la corrección.
   */
  // enviarObservacion(): void {
  //   if (!this.observacionComentario) {
  //     this.mostrarToast('❌ Debe ingresar una observación.');
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append('comentario', this.observacionComentario);
  //   formData.append('proyecto_id', this.proyectoACorregir.id);
  //   // Se asume que el proyecto tiene una propiedad 'fase_id' para indicar la fase actual.
  //   // formData.append('fase_id', this.proyectoACorregir.fase_id || '');
  //   if (this.observacionArchivo) {
  //     formData.append(
  //       'archivo',
  //       this.observacionArchivo,
  //       this.observacionArchivo.name
  //     );
  //   }
  //   console.log(formData);

  //   this.proyectosService.enviarObservacion(formData).subscribe({
  //     next: (response) => {
  //       this.mostrarToast('Observación enviada correctamente.');
  //       this.cancelarObservacion();
  //       this.cargarProyectos();
  //     },
  //     error: (err) => {
  //       console.error('Error al enviar la observación:', err);
  //       this.mostrarToast('❌ Error al enviar la observación.');
  //     },
  //   });
  // }
  enviarObservacion(): void {
    if (!this.observacionComentario) {
      this.mostrarToast('❌ Debe ingresar una observación.');
      return;
    }

    const formData = new FormData();
    formData.append('comentario', this.observacionComentario);
    formData.append('proyecto_id', this.proyectoACorregir.id);

    // Si deseas usar "archivo[]" como array de archivos en el backend:
    this.observacionArchivos.forEach((file, index) => {
      // El nombre del campo archivo[] indicará un array en Laravel
      formData.append('archivo[]', file, file.name);
    });

    this.indicarCorreccion(this.proyectoACorregir);

    this.proyectosService.enviarObservacion(formData).subscribe({
      next: (response) => {
        this.mostrarToast('Observación enviada correctamente.');

        this.cancelarObservacion();
        this.cargarProyectos();
      },
      error: (err) => {
        console.error('Error al enviar la observación:', err);
        this.mostrarToast('❌ Error al enviar la observación.');
      },
    });
  }

  /**
   * Enviar un proyecto a corrección
   * @param proyecto Proyecto a corregir
   */
  indicarCorreccion(proyecto: any): void {
    this.proyectosService.enviarProyectoACorreccion(proyecto.id).subscribe({
      next: () => {
        this.mostrarToast(
          ` El proyecto "${proyecto.nombre}" ha sido enviado a corrección.`
        );
        this.cargarProyectos();
      },
      error: () => {
        this.mostrarToast('❌ Error al enviar el proyecto a corrección.');
      },
    });
  }
  //region ver observaciones
  modalObservacionesVisible: boolean = false; // Controla la visibilidad del modal
  observaciones: any[] = []; // Almacena la lista de observaciones de un proyecto
  proyectoConObservaciones: any = null; // Guarda el proyecto para mostrar encabezado o identificar
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
        this.mostrarToast('❌ Error al obtener observaciones del proyecto.');
      },
    });
  }

  cerrarModalObservaciones(): void {
    this.modalObservacionesVisible = false;
    this.observaciones = [];
    this.proyectoConObservaciones = null;
  }

  descargarArchivo(archivo: any): void {
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
}

  

