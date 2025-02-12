import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './features/admin/dashboard/admin-dashboard.component';
import { ConvocatoriasComponent } from './features/admin/convocatorias/convocatorias.component';
import { ConvocatoriaCrearComponent } from './features/admin/publicarConvocatoria/convocatoria-publicar.component';
import { AdminUserCrearComponent } from './features/admin/user/admin-users.component';
import {AdminUsersListComponent } from './features/admin/userList/admin-users-list.component';
import { LayoutComponent } from './features/admin/dashboard/layout/layout.component';
import { LayoutprofeComponent } from './features/admin/profesor/dashboard/layout/layoutprofe.component';
import { LayoutstudentComponent } from './features/admin/estudiante/dashboard/layout/layoutstudent.component';
import { NotasComponent } from './features/admin/estudiante/Notas/notas.component';
import { ConvocatoriasProfeComponent } from './features/admin/profesor/convocatorias/convocatoriasProfe.component';
import { ProyectoComponent } from './features/admin/profesor/proyecto/proyecto.component';
import { ConvocatoriaArchivosComponent } from './features/admin/profesor/convocatorias/convocatoria-archivos/convocatoria-archivos.component';
import { PruebasComponent } from './features/admin/profesor/pruebas/pruebas.component';
import { ProyectosComponent } from './features/admin/convocatoriaProyectos/proyectos/proyectos.component';
import { ProyectosDetalleComponent } from './features/admin/convocatoriaProyectos/proyectos-detalle/proyectos-detalle.component';
import { ProyectoFase2Component } from './features/admin/profesor/proyecto-fase2/proyecto-fase2.component';
import { ProyectoFase3Component } from './features/admin/profesor/proyecto-fase3/proyecto-fase3.component';
//import { ProyectosComponent } from './features/admin/proyectos/proyectos.component';
//import { ArchivosComponent } from './features/admin/archivos/archivos.component';
//import { RepositorioComponent } from './features/admin/repositorio/repositorio.component';
//import { NotasComponent } from './features/admin/notas/notas.component';
//import { NotificacionesComponent } from './features/admin/notificaciones/notificaciones.component';

export const routes: Routes = [
  { path: '', component: HomeComponent,},
  // Ruta para el login
  { path: 'login', component: LoginComponent },

  // Rutas para el panel de administrador con subrutas
  {
    path: 'panel',
    component: LayoutComponent, // Layout compartido
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'revisor'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, data: { breadcrumb: 'Dashboard' }, },
      { path: 'users', component: AdminUserCrearComponent, data: { breadcrumb: 'Crear Usuarios' }, },
      { path: 'users/list', component: AdminUsersListComponent, data: { breadcrumb: 'Listar Usuarios' },},
      { path: 'convocatorias/crear', component: ConvocatoriaCrearComponent,data: { breadcrumb: 'Crea Convocatoria'},},
      //ruta para la vista de proyectos
      { path: 'convocatorias', component: ConvocatoriasComponent, data: { breadcrumb: 'Listar Convocatorias' }, },
      { path: 'convocatorias/proyectos/:id', component: ProyectosComponent, data: { breadcrumb: 'Proyectos' }, },
      { path: 'proyectos/detalle/:id', component: ProyectosDetalleComponent, data: { breadcrumb: 'Proyecto detalle' }, },
            { path: 'convocatorias/editar/:id', component: ConvocatoriaCrearComponent, data: { breadcrumb: 'Editar Convocatoria' },},

 

      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
    
  },

  {
    path: 'profesor',
    component: LayoutprofeComponent,
    canActivate: [AuthGuard], // Asegúrate de que este guard esté configurado correctamente
    data: { roles: ['profesor'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, data: { breadcrumb: 'Dashboard' }, },
      { path: 'convocatorias/publicadas', component: ConvocatoriasProfeComponent, data: { breadcrumb: 'Convocatorias' }, },
      { path: 'convocatorias/convocatoriarchivos/:id', component: ConvocatoriaArchivosComponent, data: { breadcrumb: 'Archivos' }, },
      { path: 'convocatorias/pruebas', component: PruebasComponent, data: { breadcrumb: 'Pruebas' }, },
      { path: 'convocatorias/proyectos/:id', component: ProyectoComponent, data: { breadcrumb: 'Proyecto' }, },

      { path: 'convocatorias/fase2/:id', component: ProyectoFase2Component, data: { breadcrumb: 'Fase 2' }, },
      { path: 'convocatorias/fase3/:id', component: ProyectoFase3Component, data: { breadcrumb: 'Fase 3' }, },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },  
    ],
    
  },


  {
    path: 'estudiante',
    component: LayoutstudentComponent,
    canActivate: [AuthGuard], // Asegúrate de que este guard esté configurado correctamente
    data: { roles: ['estudiante'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent, data: { breadcrumb: 'Dashboard' }, },
      { path: 'nota', component: NotasComponent, data: { breadcrumb: 'Listar Convocatorias' }, },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },  
    ],
    
  },

  // Ruta para redirigir rutas no válidas
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

