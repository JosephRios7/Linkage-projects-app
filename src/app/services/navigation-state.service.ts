import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Hace que este servicio esté disponible en toda la aplicación
})
export class NavigationStateService {
  // Estado para controlar si estás dentro de una convocatoria
  private convocatoriaIdSource = new BehaviorSubject<string | null>(null);
  convocatoriaId$ = this.convocatoriaIdSource.asObservable();

  setConvocatoriaId(id: string | null): void {
    console.log('Convocatoria ID actualizado:', id); // Verifica aquí
    this.convocatoriaIdSource.next(id);
  }
}
