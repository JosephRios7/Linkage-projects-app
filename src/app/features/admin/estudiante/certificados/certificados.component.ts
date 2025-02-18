import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { CertificadoService } from '../../../../services/certificado/certificado.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-certificados-estudiante',
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css'],
  imports: [CommonModule]
})
export class CertificadosComponentEstudiante implements OnInit {
  user: any;
  certificados: any[] = [];

  constructor(
    private authService: AuthService,
    private certificadoService: CertificadoService,
  ) {}

  ngOnInit(): void {
    // Se obtiene la información del estudiante en sesión
    this.user = this.authService.getUser();
    if (this.user && this.user.id) {
      this.cargarCertificados(this.user.id);
    }
  }

  cargarCertificados(userId: number): void {
    this.certificadoService.getCertificadosPorEstudiante(userId).subscribe({
      next: (response) => {
        // Se asume que el backend devuelve { certificados: [...] }
        this.certificados = response.certificados;
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
}
