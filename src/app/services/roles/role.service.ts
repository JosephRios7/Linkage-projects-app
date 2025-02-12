import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor() {}

  // Obtiene el rol del usuario desde localStorage
  getRole(): string {
    return localStorage.getItem('role') || '';
  }

  // Verifica si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    return this.getRole() === role;
  }

  // Verifica si el usuario tiene uno de varios roles
  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.getRole());
  }
}
