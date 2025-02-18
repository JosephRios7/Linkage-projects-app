import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { CertificadoService } from '../../../../services/certificado/certificado.service';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificados',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css'],
  imports: [CommonModule],
})
export class CertificadosComponent implements OnInit {
  user: any;
  certificados: any[] = [];

  constructor(
    private authService: AuthService,
    private certificadoService: CertificadoService
  ) {}

  ngOnInit(): void {
    // Obtener los datos del docente en sesión
    this.user = this.authService.getUser();
    if (this.user && this.user.id) {
      this.cargarCertificados(this.user.id);
    }
  }

  cargarCertificados(userId: number): void {
    this.certificadoService.getCertificadosPorDocente(userId).subscribe({
      next: (response) => {
        // Asumiendo que el backend devuelve { certificados: [...] }
        this.certificados = response.certificados;
        console.log(this.certificados);
      },
      error: (error) => {
        console.error('Error al cargar los certificados:', error);
      },
    });
  }

  descargarArchivo(archivo: any): void {
    // archivo.file_data es la cadena en base64
    // archivo.mime_type es, por ejemplo, "application/pdf"
    // archivo.titulo es el nombre original
    const byteCharacters = atob(archivo.file_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: archivo.mime_type });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = archivo.titulo;
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  descargarCSV(): void {
    // Encabezado del CSV
    let csvContent =
      'Nombre,Apellido,Cedula,Genero,Correo,Nota Docente,Nota Admin,Nota Final,Estado\n';

    // Recorrer cada certificado y de cada proyecto sus miembros (filtrando estudiantes)
    this.certificados.forEach((certificado) => {
      if (certificado.proyecto && certificado.proyecto.miembros) {
        certificado.proyecto.miembros.forEach((miembro: any) => {
          if (
            miembro.role === 'estudiante' &&
            miembro.user &&
            miembro.user.estudiante
          ) {
            const estudiante = miembro.user.estudiante;
            // Unir los campos sin agregar comillas
            const fila = [
              estudiante.nombre,
              estudiante.apellido,
              estudiante.cedula,
              estudiante.genero,
              estudiante.correo,
              estudiante.nota_docente,
              estudiante.nota_admin,
              estudiante.nota_final,
              estudiante.estado,
            ].join(',');
            csvContent += fila + '\n';
          }
        });
      }
    });

    // Crear el Blob y forzar descarga
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'estudiantes_certificados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  toggleNotas(certificado: any): void {
    certificado.mostrarNotas = !certificado.mostrarNotas;
  }
}