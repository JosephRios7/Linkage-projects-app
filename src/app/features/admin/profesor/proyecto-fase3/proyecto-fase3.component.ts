import { Component } from '@angular/core';
import { NavigationStateService } from '../../../../services/navigation-state.service';
import { ConvocatoriaService } from '../../../../services/Convocatoria/convocatoria.service';
import { Convocatoria } from '../../../../models/convocatoria.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyecto-fase3',
  imports: [CommonModule],
  templateUrl: './proyecto-fase3.component.html',
  styleUrl: './proyecto-fase3.component.css'
})
export class ProyectoFase3Component {
  convocatoria: Convocatoria | null = null; // Información de la convocatoria
  
    errorMessage: string | null = null;
    constructor(
      private route: ActivatedRoute,
      private convocatoriaService: ConvocatoriaService,
      private navigationStateService: NavigationStateService
    ) {}
  
    ngOnInit(): void {
      // Obtener el ID de la convocatoria desde la URL
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        console.log('ID obtenido desde la URL:', id); // Verifica el ID
        this.navigationStateService.setConvocatoriaId(id); // Almacenar el ID en el servicio
      }
    }
  
    ngOnDestroy(): void {
      // Limpiar el estado del ID de convocatoria al salir del componente
      this.navigationStateService.setConvocatoriaId(null);
    }

}
