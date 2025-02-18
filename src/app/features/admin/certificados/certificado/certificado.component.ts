import { Component } from '@angular/core';
import { CertificadoService } from '../../../../services/certificado/certificado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConvocatoriaService } from '../../../../services/Convocatoria/convocatoria.service';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';

@Component({
  selector: 'app-certificado',
  templateUrl: './certificado.component.html',
  styleUrls: ['./certificado.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CertificadoComponent {
  // proyectos: any[] = [];
  // participantes: any = null;
  // proyectoId: number | null = null;
  // cargando: boolean = false;
  // errorMensaje: string = '';
  convocatorias: any[] = [];
  proyectos: any[] = [];
  miembros: any[] = [];
  proyectoSeleccionado: any = null;
  cargando: boolean = false;
  errorMensaje: string = '';

  constructor(
    private certificadoService: CertificadoService,
    private convocatoriaService: ConvocatoriaService,
    private proyectosService: ProyectosService,
    
  ) {}

  ngOnInit() {
    // this.obtenerProyectos();
    this.listarConvocatorias();
  }

  listarConvocatorias(): void {
    this.cargando = true;
    this.convocatoriaService.listarConvocatoriasPublicasFinalizadas().subscribe({
      next: (data) => {
        this.convocatorias = data;
        this.cargando = false;
        console.log('convocatorias',this.convocatorias);
      },
      error: (err) => {
        this.errorMensaje = 'Error al cargar las convocatorias.';
        this.cargando = false;
      },
    });
  }
  seleccionarConvocatoria(convocatoria: any): void {
    // Al seleccionar una convocatoria, resetea proyectos y miembros
    this.proyectoSeleccionado = null;
    this.proyectos = [];
    this.miembros = [];
    this.cargando = true;
    this.proyectosService
      .listarProyectosPorConvocatoria(convocatoria.id)
      .subscribe({
        next: (data) => {
          this.proyectos = data.proyectos;
          console.log(data);
          this.cargando = false;
        },
        error: (err) => {
          this.errorMensaje =
            'Error al cargar los proyectos de la convocatoria.';
          this.cargando = false;
        },
      });
  }
  seleccionarProyecto(proyecto: any): void {
    this.proyectoSeleccionado = proyecto;
    this.cargando = true;
    this.convocatoriaService.getMiembrosConCertificados(proyecto.id).subscribe({
      next: (data) => {
        this.miembros = data;
        console.log(data)
        this.cargando = false;
      },
      error: (err) => {
        this.errorMensaje = 'Error al cargar los miembros del proyecto.';
        this.cargando = false;
      },
    });
  }

  contarPorRol(rol: string): number {
    if (!this.miembros) return 0;
    return this.miembros.filter((m) => m.role === rol).length;
  }

  descargarArchivo(archivo: any): void {
    // archivo.file_data es la cadena en base64
    // archivo.mime_type es, por ejemplo, "application/pdf"
    // archivo.titulo es el nombre original
    const byteCharacters = atob(archivo.file_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: archivo.mime_type });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = archivo.titulo;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }
  // // Obtener la lista de proyectos
  // obtenerProyectos() {
  //   this.cargando = true;
  //   this.certificadoService.getProyectos().subscribe(
  //     (response) => {
  //       this.proyectos = response;
  //       this.cargando = false;
  //     },
  //     (error) => {
  //       this.errorMensaje = 'Error al obtener los proyectos';
  //       this.cargando = false;
  //     }
  //   );
  // }

  // // Guardar el proyecto seleccionado y obtener los participantes
  // seleccionarProyecto(proyecto: any) {
  //   this.proyectoId = proyecto.id;
  //   this.obtenerParticipantes();
  // }

  // // Obtener la lista de participantes del proyecto seleccionado
  // obtenerParticipantes() {
  //   if (!this.proyectoId) {
  //     this.errorMensaje = 'Seleccione un proyecto primero';
  //     return;
  //   }
  //   this.errorMensaje = '';
  //   this.cargando = true;

  //   this.certificadoService.obtenerParticipantes(this.proyectoId).subscribe(
  //     (response) => {
  //       console.log('Participantes:', response);
  //       this.participantes = response;
  //       this.cargando = false;
  //     },
  //     (error) => {
  //       this.errorMensaje = 'Error al obtener los participantes';
  //       this.cargando = false;
  //     }
  //   );
  // }

  // // Descargar el certificado del estudiante
  // descargarCertificado(estudianteId: number) {
  //   if (!this.proyectoId) {
  //     console.error('Error: No se ha seleccionado un proyecto.');
  //     return;
  //   }

  //   console.log(
  //     `Descargando certificado para Proyecto ID: ${this.proyectoId}, Estudiante ID: ${estudianteId}`
  //   );

  //   this.certificadoService
  //     .descargarCertificado(this.proyectoId, estudianteId)
  //     .subscribe(
  //       (response) => {
  //         const blob = new Blob([response], { type: 'application/pdf' });
  //         const url = window.URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.href = url;
  //         a.download = `certificado_${this.proyectoId}_${estudianteId}.pdf`;
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);
  //       },
  //       (error) => {
  //         console.error('Error al descargar el certificado:', error);
  //       }
  //     );
  // }
}

