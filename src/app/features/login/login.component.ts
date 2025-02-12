import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false; // Indicador de carga

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['user@gmail.com', [Validators.required, Validators.email]],
      password: ['password', Validators.required],
    });
  }

  // Método para manejar el login
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true; // Mostrar indicador de carga
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Respuesta del servidor:', response);
        
          this.authService.setToken(response.access_token);
          this.authService.setUser(response.user);
        
          if (response.user?.role) {
            this.redirectUserByRole(response.user.role);
          } else {
            this.errorMessage = 'El usuario no tiene un rol asignado.';
          }
        },
        
        error: (error) => {
          this.loading = false; // Ocultar indicador de carga
          if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas. Inténtalo de nuevo.';
          } else {
            this.errorMessage = 'Ocurrió un error inesperado. Por favor, inténtalo más tarde.';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }

  // Método para redirigir según el rol
  private redirectUserByRole(role: string): void {
    role = role.toLowerCase(); // Convertir a minúsculas por seguridad

    if (role === 'admin') {
      this.router.navigate(['/panel/dashboard']);
    } else if (role === 'profesor') {
      this.router.navigate(['/profesor/dashboard']);
    } else if (role === 'revisor') {
      this.router.navigate(['/panel/dashboard']);
    } else if (role === 'estudiante') {
      this.router.navigate(['/estudiante/dashboard']);
    } else {
      this.errorMessage = 'Rol no reconocido.';
    }
  }
}
