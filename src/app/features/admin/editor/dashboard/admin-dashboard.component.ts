import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, RouterModule]
})
export class AdminDashboardComponent {
  username: string = '';

  constructor(private router: Router) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.username = user.name || 'estudiante';
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
