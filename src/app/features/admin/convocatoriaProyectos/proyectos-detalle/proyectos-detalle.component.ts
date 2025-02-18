import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyectos-detalle',
  templateUrl: './proyectos-detalle.component.html',
  styleUrls: ['./proyectos-detalle.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ProyectosDetalleComponent implements OnInit {
  proyecto: any = null;
  docenteCoordinador: any = null;
  estudiantes: any[] = [];

  // Mapa/diccionario para agrupar archivos por nombre de fase
  archivosPorFase: { [faseNombre: string]: any[] } = {};
id: number = 0;
  constructor(
    private route: ActivatedRoute,
    private proyectosService: ProyectosService,
        private cdr: ChangeDetectorRef
    
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.cargarDetalleProyecto(this.id);
  }

  // Método para descargar un archivo (ejemplo)
  descargarArchivoProyecto(archivoId: number): void {
    this.proyectosService.descargarArchivoProyecto(archivoId);
  }

  cargarDetalleProyecto(id: number): void {
    this.proyectosService.obtenerDetalleProyecto(id).subscribe({
      next: (response) => {
        this.proyecto = response.proyecto;
        console.log('Proyecto recibido:', this.proyecto);

        // Separar docente coordinador y estudiantes
        if (this.proyecto && this.proyecto.miembros) {
          this.docenteCoordinador = this.proyecto.miembros.find(
            (m: any) => m.role === 'profesor'
          );
          this.estudiantes = this.proyecto.miembros
            .filter((m: any) => m.role === 'estudiante')
            .sort((a: any, b: any) =>
              a.detalles.nombre.localeCompare(b.detalles.nombre)
            );
        }

        // Agrupar archivos por fase
        this.agruparArchivosPorFase();
      },
      error: (err) => {
        console.error('Error al cargar detalles del proyecto:', err);
      },
    });
  }
  //region vaidar nota
  notaInvalida: boolean = false;
  validateNota(event: any) {
    const value = event.target.value;

    // Validar si el valor está entre 1 y 10 y tiene hasta dos decimales
    const isValid =
      /^\d*(\.\d{0,2})?$/.test(value) && value >= 1 && value <= 10;

    if (!isValid) {
      this.notaInvalida = true;
      // Si no es válido, borrar el contenido
      event.target.value = '';
    } else {
      this.notaInvalida = false;
    }
  }
  //endregion

  /**
   * Agrupa los archivos del proyecto según el nombre de su fase
   */
  agruparArchivosPorFase(): void {
    this.archivosPorFase = {};

    if (!this.proyecto?.archivos) {
      return;
    }

    this.proyecto.archivos.forEach((archivo: any) => {
      // Por seguridad, verifica que tenga la relación "fase"
      const faseNombre = archivo?.fase?.nombre || 'Sin fase';

      // Si no existe la clave, se inicializa con un array vacío
      if (!this.archivosPorFase[faseNombre]) {
        this.archivosPorFase[faseNombre] = [];
      }
      // Agregar el archivo al arreglo correspondiente
      this.archivosPorFase[faseNombre].push(archivo);
    });
  }
  getFaseNombres(): string[] {
    return Object.keys(this.archivosPorFase);
  }

  // Método para enviar las notas administrativas y finalizar el proyecto (fase 3)
  finalizarProyecto(): void {
    if (!this.proyecto || !this.proyecto.id) {
      console.error('Proyecto no definido');
      return;
    }
    // Crear FormData
    const formData = new FormData();
    // Agregar id del proyecto
    formData.append('proyecto_id', this.proyecto.id.toString());

    // Agregar las notas administrativas de cada estudiante
    this.estudiantes.forEach((est, index) => {
      // Se asume que cada estudiante tiene un id y la propiedad nota_admin en "detalles"
      formData.append(`estudiantes[${index}][id]`, est.detalles.id.toString());
      formData.append(
        `estudiantes[${index}][nota_admin]`,
        est.detalles.nota_admin
      );
    });

    // Llamar al servicio para finalizar la fase 3
    this.proyectosService
      .finalizarProyectoFase3(this.proyecto.id, formData)
      .subscribe({
        next: (response) => {
          console.log('Proyecto finalizado', response);
          // Aquí puedes notificar al usuario o redireccionar
          this.cargarDetalleProyecto(this.id);
           this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al finalizar proyecto', err);
        },
      });
  }
}
