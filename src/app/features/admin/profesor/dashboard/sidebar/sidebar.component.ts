// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
// import { NavigationStateService } from '../../../../../services/navigation-state.service';

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
//   styleUrls: ['./sidebar.component.css'],
//   imports: [RouterLink, RouterLinkActive, CommonModule],
// })
// export class SidebarComponent implements OnInit {
//   convocatoriaId: string | null = null;

//   constructor(private navigationStateService: NavigationStateService) {}

//   ngOnInit(): void {
//     this.navigationStateService.convocatoriaId$.subscribe((id) => {
//       console.log('Convocatoria ID recibido en Sidebar:', id); // Verifica aquí
//       this.convocatoriaId = id; // Actualiza el ID dinámicamente
//     });
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NavigationStateService } from '../../../../../services/navigation-state.service';
// IMPORTA TU SERVICIO
import { ConvocatoriaService } from '../../../../../services/Convocatoria/convocatoria.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class SidebarComponent implements OnInit {
  convocatoriaId: string | null = null;

  // Variables de control
  canShowAvance: boolean = false;
  canShowCierre: boolean = false;

  constructor(
    private navigationStateService: NavigationStateService,
    private convocatoriaService: ConvocatoriaService // o ProyectosService
  ) {}

  ngOnInit(): void {
    // 1. Escuchar convocatoriaId
    this.navigationStateService.convocatoriaId$.subscribe((id) => {
      console.log('Convocatoria ID recibido en Sidebar:', id);
      this.convocatoriaId = id;
    });

    // 2. Llamar al servicio para obtener proyectos aprobados del docente
    this.convocatoriaService.obtenerProyectosDelProfesor().subscribe({
      next: (response) => {
        // Revisa en consola el objeto:
        console.log('Proyectos aprobados:', response);

        // Si la respuesta es { proyectos: [ ... ] }
        const proyectos = response.proyectos || [];

        // Ahora si, filtras
        const proyectosFase1 = proyectos.filter(
          (p: any) => p.fase === 'Fase2' || p.fase === 'Fase3'
        );

        if (proyectosFase1.length > 0) {
          this.canShowAvance = true;
        }

        // Filtrar proyectos Fase2
        const proyectosFase2 = proyectos.filter((p: any) => p.fase === 'Fase3');
        if (proyectosFase2.length > 0) {
          this.canShowCierre = true;
        }
      },
      error: (err) => {
        console.error('Error al obtener proyectos aprobados:', err);
      },
    });
  }
}
