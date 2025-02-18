import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { NavigationStateService } from '../../../../services/navigation-state.service';

@Component({
  selector: 'app-notas',
  imports: [],
  templateUrl: './notas.component.html',
  styleUrl: './notas.component.css',
})
export class NotasComponent implements OnInit, OnDestroy {
  proyecto: any;
  user: any;
  constructor(
    private authService: AuthService,
    private navigationStateService: NavigationStateService
  ) {}
  ngOnInit(): void {
    this.user = this.authService.getUser(); // Método que retorna los datos del docente en sesión
  }
  ngOnDestroy(): void {
    this.navigationStateService.setConvocatoriaId(null); // Limpiar el ID en el servicio
  }
}
