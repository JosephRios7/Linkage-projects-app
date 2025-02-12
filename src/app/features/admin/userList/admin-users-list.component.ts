import { Component, OnInit } from '@angular/core';
import { UserServices } from '../../../services/user/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AdminUsersListComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = []; // Para búsqueda
  searchQuery: string = ''; // Input de búsqueda
  currentPage: number = 1;
  totalPages: number = 0;
  errorMessage: string = '';

  mostrarModal: boolean = false; // Controla la visibilidad del modal
  usuarioSeleccionado: any = null; // Usuario que se desea eliminar

  constructor(private userService: UserServices) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Cargar usuarios desde el servicio
  loadUsers(page: number = 1): void {
    this.userService.listUsers(page).subscribe({
      next: (response) => {
        if (response && response.users) {
          this.users = response.users;
          this.filteredUsers = [...this.users]; // Inicializar la lista filtrada
          this.totalPages = response.totalPages || 1; // Asegurar que totalPages se actualice
        } else {
          this.errorMessage = 'Estructura de respuesta inesperada.';
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.errorMessage = 'Error al cargar los usuarios.';
      },
    });
  }

  // Filtrar usuarios
  filterUsers(): void {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Abrir modal de confirmación
  abrirModalConfirmacion(user: any): void {
    this.usuarioSeleccionado = user;
    this.mostrarModal = true;
  }

  // Cerrar modal de confirmación
  cerrarModal(): void {
    this.mostrarModal = false;
    this.usuarioSeleccionado = null;
  }

  // Confirmar y eliminar usuario
  confirmarEliminarUsuario(): void {
    if (!this.usuarioSeleccionado) return;

    this.userService.deleteUser(this.usuarioSeleccionado.id).subscribe({
      next: () => {
        this.filteredUsers = this.filteredUsers.filter(
          (user) => user.id !== this.usuarioSeleccionado.id
        );
        this.users = this.users.filter(
          (user) => user.id !== this.usuarioSeleccionado.id
        );
        this.errorMessage = ''; // Limpiar mensaje de error si la operación es exitosa
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.errorMessage = 'Error al eliminar el usuario.';
        this.cerrarModal();
      },
    });
  }
}
