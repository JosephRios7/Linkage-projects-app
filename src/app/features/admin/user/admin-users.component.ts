import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule,  } from '@angular/forms';
import { UserServices } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule] 
})
export class AdminUserCrearComponent {
  userForm: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserServices
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  crearUsuario(): void {
    if (this.userForm.valid) {
      this.cargando = true;

      this.userService.createUser(this.userForm.value).subscribe({
        next: (response) => {
          this.mensajeExito = 'Usuario creado con éxito.';
          this.mensajeError = '';
          this.userForm.reset();
          this.cargando = false;
        },
        error: (err) => {
          this.mensajeError = 'Error al crear el usuario.';
          this.mensajeExito = '';
          this.cargando = false;
        },
      });
    } else {
      this.mensajeError = 'Por favor, completa todos los campos requeridos.';
    }
  }
}
