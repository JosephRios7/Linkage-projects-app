import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard-profe',
  templateUrl: './admin-dashboard-profe.component.html',
  styleUrls: ['./admin-dashboard-profe.component.css'],
  imports: [CommonModule, RouterModule]
})
export class AdminDashboardProfeComponent {
  username: string = '';

  constructor(private router: Router) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.name || 'profesor';
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
