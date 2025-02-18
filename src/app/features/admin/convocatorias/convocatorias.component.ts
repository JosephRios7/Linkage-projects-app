import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ConvocatoriaService } from '../../../services/Convocatoria/convocatoria.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Archivo, Convocatoria } from '../../../models/convocatoria.model';
import { Router, RouterModule } from '@angular/router';
import { ArchivoService } from '../../../services/ConvocatoriaArchivoService/archivo.service';

@Component({
  selector: 'app-convocatorias',
  templateUrl: './convocatorias.component.html',
  styleUrls: ['./convocatorias.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
})
export class ConvocatoriasComponent implements OnInit {
  private router = inject(Router);
  convocatorias: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  searchTerm: string = '';
  mostrarModal: boolean = false; // Controla la visibilidad del modal
  archivosSeleccionados: Archivo[] = []; // Almacena los archivos seleccionados para el modal

  // Variables para la confirmación de acciones
  mostrarConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  accionPendiente: { tipo: string; id: number | null } = { tipo: '', id: null };

  // Variable para la convocatoria actual
  convocatoriaActual: any = null;
  // Array para los archivos asociados a la convocatoria (tipo "convocatoria")
  archivosConvocatoria: any[] = [];
  // Array para las fases; cada fase tendrá un atributo "archivos" que se llenará con los archivos de fase
  fases: any[] = [];

  constructor(
    private convocatoriaService: ConvocatoriaService,
    private archivoService: ArchivoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.listarConvocatorias();
  }

  listarConvocatorias(): void {
    this.convocatoriaService
      .listarConvocatorias(this.currentPage, this.searchTerm)
      .subscribe({
        next: (response) => {
          if (Array.isArray(response)) {
            this.convocatorias = response.map((convocatoria: Convocatoria) => {
              convocatoria.archivos = convocatoria.archivos?.map(
                (archivo: Archivo) => {
                  return {
                    ...archivo,
                    url: this.convocatoriaService.getFileUrl(archivo.file_path),
                  };
                }
              );
              return convocatoria;
            });
          } else {
            console.error('Datos de convocatorias no válidos:', response);
            this.convocatorias = [];
          }
        },
        error: (err) => {
          console.error('Error al listar convocatorias:', err);
        },
      });
  }

  abrirModal(archivos: Archivo[]): void {
    this.archivosSeleccionados = archivos;
    this.mostrarModal = true;
  }

  // cerrarModal(): void {
  //   this.mostrarModal = false;
  //   this.archivosSeleccionados = [];
  // }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.listarConvocatorias();
  }

  onSearch(): void {
    this.currentPage = 1; // Reinicia a la primera página al buscar
    this.listarConvocatorias();
  }

  publicarConvocatoria(id: number): void {
    this.convocatoriaService.publicarConvocatoria(id).subscribe({
      next: (response) => {
        console.log('Convocatoria publicada:', response);
        this.listarConvocatorias();
      },
      error: (err) => {
        console.error('Error al publicar convocatoria:', err);
      },
    });
  }

  eliminarConvocatoria(id: number): void {
    this.convocatoriaService.eliminarConvocatoria(id).subscribe({
      next: (response) => {
        console.log('Convocatoria eliminada:', response);
        this.listarConvocatorias();
      },
      error: (err) => {
        console.error('Error al eliminar convocatoria:', err);
      },
    });
  }

  finalizarConvocatoria(id: number): void {
    this.convocatoriaService.finalizarConvocatoria(id).subscribe({
      next: (response) => {
        console.log('Convocatoria finalizada:', response);
        this.listarConvocatorias();
      },
      error: (err) => {
        console.error('Error al finalizar convocatoria:', err);
      },
    });
  }
  public today: Date = new Date();
  convertToDate(value: any): Date {
    return value ? new Date(value) : new Date();
  }
  // Método para mostrar la confirmación de una acción
  confirmarAccion(tipo: string, id: number): void {
    this.mostrarConfirmacion = true;
    this.accionPendiente = { tipo, id };
    if (tipo === 'Publicar') {
      this.mensajeConfirmacion =
        '¿Estás seguro de que deseas publicar esta convocatoria?';
    } else if (tipo === 'Eliminar') {
      this.mensajeConfirmacion =
        '¿Estás seguro de que deseas eliminar esta convocatoria?';
    } else if (tipo === 'Finalizar') {
      this.mensajeConfirmacion =
        '¿Estás seguro de que deseas finalizar esta convocatoria?';
    }
  }

  // Método para cancelar la confirmación
  cancelarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.accionPendiente = { tipo: '', id: null };
  }

  // Método para ejecutar la acción confirmada
  ejecutarAccionConfirmada(): void {
    if (this.accionPendiente.tipo === 'Publicar') {
      this.publicarConvocatoria(this.accionPendiente.id!);
    } else if (this.accionPendiente.tipo === 'Eliminar') {
      this.eliminarConvocatoria(this.accionPendiente.id!);
    } else if (this.accionPendiente.tipo === 'Finalizar') {
      this.finalizarConvocatoria(this.accionPendiente.id!);
    }
    this.cancelarConfirmacion();
  }

  // Método para extraer el nombre del archivo de una URL
  extractFileName(fileUrl: string): string {
    return fileUrl.split('/').pop() || 'Archivo';
  }
  abrirModalConvocatoria(convocatoria: any): void {
    // Asignar la convocatoria actual
    this.convocatoriaActual = convocatoria;
    // Reiniciar las variables de archivos y fases
    this.archivosConvocatoria = [];
    this.fases = [];

    // Consultar los archivos asociados a la convocatoria
    this.archivoService.listarArchivosConvocatoria(convocatoria.id).subscribe({
      next: (data) => {
        this.archivosConvocatoria = data;
      },
      error: (err) => {
        console.error('Error al cargar archivos de convocatoria:', err);
      },
    });

    // Consultar las fases asociadas (desde la tabla fase_convocatorias)
    this.convocatoriaService.listarFases(convocatoria.id).subscribe({
      next: (fasesData) => {
        this.fases = fasesData; // Asignamos las fases obtenidas
        // Para cada fase, cargar sus archivos mediante el servicio de archivos
        this.fases.forEach((fase: any, index: number) => {
          this.archivoService.listarArchivosFase(fase.id).subscribe({
            next: (files) => {
              this.fases[index].archivos = files;
            },
            error: (err) => {
              console.error(
                `Error al cargar archivos para la fase ${fase.id}:`,
                err
              );
            },
          });
        });
      },
      error: (err) => {
        console.error('Error al cargar fases:', err);
      },
    });

    // Abrir el modal
    this.mostrarModal = true;
  }



  // Método para cerrar el modal
  cerrarModal(): void {
    this.mostrarModal = false;
    // Limpiar las variables si se desea
    this.convocatoriaActual = null;
    this.archivosConvocatoria = [];
    this.fases = [];
  }

  //region archivos
  //Variables para manejo de confirmaciones de acción sobre archivos
  accionArchivoPendiente: {
    tipo: string;
    entidad: 'convocatoria' | 'fase';
    archivo: any;
  } = { tipo: '', entidad: 'convocatoria', archivo: null };
  mostrarConfirmacionArchivo: boolean = false;
  mensajeConfirmacionArchivo: string = '';


  // Métodos para descargar

  cargarDatosArchivos(): void {
    if (this.convocatoriaActual) {
      // Cargar archivos de convocatoria
      this.archivoService
        .listarArchivosConvocatoria(this.convocatoriaActual.id)
        .subscribe({
          next: (data) => {
            this.archivosConvocatoria = data;
          },
          error: (err) => console.error(err),
        });

      // Consultar las fases asociadas desde el endpoint, en lugar de usar this.convocatoriaActual.fases
      this.convocatoriaService
        .listarFases(this.convocatoriaActual.id)
        .subscribe({
          next: (fasesData) => {
            this.fases = fasesData; // Asignamos las fases obtenidas
            // Para cada fase, cargar sus archivos mediante el servicio de archivos
            this.fases.forEach((fase: any, index: number) => {
              this.archivoService.listarArchivosFase(fase.id).subscribe({
                next: (files) => {
                  this.fases[index].archivos = files;
                },
                error: (err) => {
                  console.error(
                    `Error al cargar archivos para la fase ${fase.id}:`,
                    err
                  );
                },
              });
            });
          },
          error: (err) => {
            console.error('Error al cargar fases:', err);
          },
        });
    }
  }

  descargarArchivoConv(archivoId: number): void {
    this.archivoService.descargarArchivoConvocatoria(archivoId);
  }

  descargarArchivoFase(archivoId: number): void {
    this.archivoService.descargarArchivoFase(archivoId);
  }

  // Método para solicitar confirmación para acciones sobre archivos
  confirmarAccionArchivo(
    tipo: string,
    entidad: 'convocatoria' | 'fase',
    archivo: any
  ): void {
    this.accionArchivoPendiente = { tipo, entidad, archivo };
    if (tipo === 'Eliminar') {
      this.mensajeConfirmacionArchivo =
        '¿Estás seguro de eliminar este documento?';
    } else if (tipo === 'Subir') {
      this.mensajeConfirmacionArchivo =
        '¿Estás seguro de subir un nuevo archivo?';
    }
    this.mostrarConfirmacionArchivo = true;
    console.log(this.mostrarConfirmacionArchivo);
  }

  cancelarConfirmacionArchivo(): void {
    this.mostrarConfirmacionArchivo = false;
    this.accionArchivoPendiente = {
      tipo: '',
      entidad: 'convocatoria',
      archivo: null,
    };
  }

  ejecutarAccionArchivoConfirmada(): void {
    const { tipo, entidad, archivo } = this.accionArchivoPendiente;
    if (tipo === 'Eliminar') {
      if (entidad === 'convocatoria') {
        this.archivoService.eliminarArchivoConvocatoria(archivo.id).subscribe({
          next: () => {
            this.archivosConvocatoria = this.archivosConvocatoria.filter(
              (a) => a.id !== archivo.id
            );
          },
          error: (err) => console.error(err),
        });
      } else {
        this.archivoService.eliminarArchivoFase(archivo.id).subscribe({
          next: () => {
            this.fases = this.fases.map((fase) => {
              fase.archivos = fase.archivos.filter(
                (a: any) => a.id !== archivo.id
              );
              return fase;
            });
          },
          error: (err) => console.error(err),
        });
      }
    } else if (tipo === 'Subir') {
      // Llamamos al método para subir archivo; se muestra un input file.
      this.subirArchivo(entidad, archivo);
    }
    this.cancelarConfirmacionArchivo();
  }

  subirArchivo(entidad: 'convocatoria' | 'fase', archivoActual: any): void {
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.onchange = (event: any) => {
      const file: File = event.target.files[0]; 
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (entidad === 'convocatoria') {
          // Si es para convocatoria, se envía el id de la convocatoria
          formData.append('entidad_id', this.convocatoriaActual.id);
          this.archivoService.subirArchivoConvocatoria(formData).subscribe({
            next: (response) => {
              // Actualizar la lista de archivos de convocatoria
              this.cargarDatosArchivos();
            },
            error: (err) => console.error(err),
          });
        } else {
          // Para fase, se envía el id de la fase correspondiente
          formData.append('fase_id', archivoActual.fase_id.toString());
          this.archivoService.subirArchivoFase(formData).subscribe({
            next: (response) => {
              // Actualizar la lista de archivos de fases
              this.cargarDatosArchivos();
            },
            error: (err) => console.error(err),
          });
        }
      }
    };
    inputFile.click();
  }
}
