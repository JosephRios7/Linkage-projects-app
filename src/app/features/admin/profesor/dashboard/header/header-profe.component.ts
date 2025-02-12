import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-profe',
  templateUrl: './header-profe.component.html',
  styleUrls: ['./header-profe.component.css'],
  imports: [CommonModule, RouterModule]
})
export class HeaderProfeComponent {
  username: string = '';
  breadcrumbs: string[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // Verifica si el usuario está almacenado en localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.name || 'Administrador';
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  // Método para actualizar breadcrumbs dinámicamente
  ngAfterContentChecked(): void {
    this.updateBreadcrumbs();
  }

  updateBreadcrumbs() {
    const root = this.activatedRoute.root;
    const breadcrumbs: string[] = ['Dashboard'];

    let currentRoute = root;

    while (currentRoute.children.length > 0) {
      const childRoute = currentRoute.children[0];
      const routeData = childRoute.snapshot.data;

      if (routeData['breadcrumb']) {
        breadcrumbs.push(routeData['breadcrumb']);
      }

      currentRoute = childRoute;
    }

    this.breadcrumbs = breadcrumbs;
  }
}
