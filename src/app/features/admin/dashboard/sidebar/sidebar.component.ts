import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, RouterModule],
})
export class SidebarComponent implements OnInit {
  userRole: string = ''; // Rol del usuario

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener el rol del usuario desde el servicio de autenticación
    this.userRole = this.authService.getRole();
  }
}
