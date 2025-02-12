import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.authService.getUser();

    // Verificar si hay un usuario autenticado
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si los roles requeridos coinciden con alguno de los roles del usuario
    const allowedRoles = route.data['roles'] as Array<string>; // Roles permitidos para esta ruta

    if (allowedRoles && allowedRoles.length > 0) {
      // Comprobar si el usuario tiene al menos uno de los roles permitidos
      const userRoles = Array.isArray(user.role) ? user.role : [user.role]; // Convertir a array si es un string único
      const hasAccess = allowedRoles.some((role) => userRoles.includes(role));

      if (!hasAccess) {
        this.router.navigate(['/']); // Redirigir a la página principal u otra ruta
        return false;
      }
    }

    return true; // Permitir el acceso
  }
}
