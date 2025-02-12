// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-proyectos-detalle',
//   templateUrl: './proyectos-detalle.component.html',
//   styleUrls: ['./proyectos-detalle.component.css'],
//   imports: [CommonModule],
// })
// export class ProyectosDetalleComponent implements OnInit {
//   proyecto: any = null;
//   docenteCoordinador: any = null;
//   estudiantes: any[] = [];
//   constructor(
//     private route: ActivatedRoute,
//     private proyectosService: ProyectosService    
//   ) {}

//   ngOnInit(): void {
//     const id = +this.route.snapshot.paramMap.get('id')!;
//     this.cargarDetalleProyecto(id);
//   }
//   descargarArchivoProyecto(archivoId: number): void {
//     this.proyectosService.descargarArchivoProyecto(archivoId);
//   }
//   cargarDetalleProyecto(id: number): void {
//     this.proyectosService.obtenerDetalleProyecto(id).subscribe({
//       next: (response) => {
//         this.proyecto = response.proyecto;
//         console.log(response.proyecto);
//         // Suponiendo que todos los miembros se encuentran en "proyecto.miembros"
//         if (this.proyecto && this.proyecto.miembros) {
//           // Extraer el docente coordinador según su rol (por ejemplo, "profesor")
//           this.docenteCoordinador = this.proyecto.miembros.find(
//             (m: any) => m.role === 'profesor'
//           );
//           // Filtrar y ordenar los estudiantes (rol "estudiante") alfabéticamente por el nombre en detalles
//           this.estudiantes = this.proyecto.miembros
//             .filter((m: any) => m.role === 'estudiante')
//             .sort((a: any, b: any) =>
//               a.detalles.nombre.localeCompare(b.detalles.nombre)
//             );
//         }
//       },
//       error: (err) => {
//         console.error('Error al cargar detalles del proyecto:', err);
//       },
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyectos-detalle',
  templateUrl: './proyectos-detalle.component.html',
  styleUrls: ['./proyectos-detalle.component.css'],
  imports: [CommonModule],
})
export class ProyectosDetalleComponent implements OnInit {
  proyecto: any = null;
  docenteCoordinador: any = null;
  estudiantes: any[] = [];

  // Mapa/diccionario para agrupar archivos por nombre de fase
  archivosPorFase: { [faseNombre: string]: any[] } = {};

  constructor(
    private route: ActivatedRoute,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.cargarDetalleProyecto(id);
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
}
