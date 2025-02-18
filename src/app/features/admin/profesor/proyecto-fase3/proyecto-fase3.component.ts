import { Component } from '@angular/core';
import { NavigationStateService } from '../../../../services/navigation-state.service';
import { ConvocatoriaService } from '../../../../services/Convocatoria/convocatoria.service';
import { Convocatoria } from '../../../../models/convocatoria.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-proyecto-fase3',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyecto-fase3.component.html',
  styleUrl: './proyecto-fase3.component.css',
})
export class ProyectoFase3Component {
  convocatoria: Convocatoria | null = null; // Información de la convocatoria

  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private convocatoriaService: ConvocatoriaService,
    private navigationStateService: NavigationStateService,
    private proyectosService: ProyectosService
  ) {
    this.projectForm = this.fb.group({
      convocatoria_id: ['', Validators.required],
      resumen: ['', Validators.required],
      estudiantes: this.fb.array([]), // FormArray para estudiantes
    });
  }
  archivosFase3: any[] = [];
  // Lista de proyectos del docente en Fase2 o Fase3
  proyectosFase3: any[] = [];
  // Modal para ver documentos de un proyecto
  modalVerDocsVisible: boolean = false;
  proyectoConDocumentos: any = null;
  documentosProyecto: any[] = [];

  // Modal para ver observaciones de un proyecto
  modalObservacionesVisible: boolean = false;
  proyectoConObservaciones: any = null;
  observaciones: any[] = [];
  // Para mostrar mensajes/errores
  showToast: boolean = false;
  toastMessage: string = '';
  convocatoriaId: string | null = null;

  ngOnInit(): void {
    // Obtener el ID de la convocatoria desde la URL
    this.convocatoriaId = this.route.snapshot.paramMap.get('id');
    if (this.convocatoriaId) {
      console.log('ID obtenido desde la URL:', this.convocatoriaId); // Verifica el ID
      this.projectForm.patchValue({ convocatoria_id: this.convocatoriaId });
      this.navigationStateService.setConvocatoriaId(this.convocatoriaId);

      // Almacenar el ID en el servicio
      this.cargarArchivosFase3(this.convocatoriaId);
    }
    // Cargar la lista de proyectos en Fase2/Fase3
    this.cargarProyectosFase3();
    this.agregarEstudiante(); // Agregar un estudiante por defecto
  }
  agregarEstudiante(): void {
    const estudianteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      genero: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nota_docente: [
        '',
        [Validators.required, Validators.min(1), Validators.max(10)],
      ], // Agregado
    });
    this.estudiantes.push(estudianteForm);
  }
  archivos: File[] = [];

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('convocatoria_id', this.projectForm.value.convocatoria_id);
    //resumen del proyecto
    formData.append('resumen', this.projectForm.value.resumen);
    // Estudiantes
    const estudiantes = this.projectForm.value.estudiantes;
    estudiantes.forEach((est: any, index: number) => {
      formData.append(`estudiantes[${index}][correo]`, est.correo);
      formData.append(`estudiantes[${index}][cedula]`, est.cedula);
      formData.append(`estudiantes[${index}][nota_docente]`, est.nota_docente);
    });
    // Archivos
    this.archivos.forEach((file) => formData.append('archivos[]', file));
    return formData;
  }
  onSubmit(): void {
    // Validar formulario
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.mostrarToast('❌ Formulario inválido. Revisa los campos.', false);
      return;
    }

    // Armar el FormData
    const formData = this.buildFormData();
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Si hay un proyectoSeleccionado con ID, vamos a actualizar
    if (this.proyectoSeleccionado && this.proyectoSeleccionado.id) {
      formData.append('proyecto_id', this.proyectoSeleccionado.id);
      this.subirFase3(formData);

      //agregar logica para enviar la nueva informacion a fase 3 del proyecto
    } else {
      // Caso contrario, nada
      console.log('nada');
    }
    this.verDetalle = false;
  }
  enviadoCorrectamente: boolean | null = null; // null = no enviado, true = éxito, false = error
  private subirFase3(formData: FormData): void {
    this.proyectosService.subirDatosFase3(formData).subscribe({
      next: () => {
        this.mostrarToast('✅ Fase 3 enviada exitosamente.', true);
        this.projectForm.reset();
        // Refrescar la lista o hacer lo necesario
        this.cargarProyectosFase3();
        this.proyectoSeleccionado = null; // Ya no está seleccionando proyecto
        this.editMode = false;
      },
      error: () => {
        this.mostrarToast('❌ Error al registrar fase 3 del proyecto.', false);
      },
    });
  }

  /**
   * Carga los proyectos del docente que estén en Fase2 o Fase3
   */
  cargarProyectosFase3(): void {
    // Podrías reutilizar tu "obtenerProyectosDelProfesor" y filtrar
    // o crear un nuevo método en el backend que ya devuelva solo Fase2/Fase3.
    this.convocatoriaService.obtenerProyectosDelProfesor().subscribe({
      next: (resp) => {
        // Filtrar en TS (si el backend no los filtra directamente)
        this.proyectosFase3 = resp.proyectos.filter(
          (p: any) => p.fase === 'Fase3'
        );
      },
      error: (err) => {
        console.error('Error al cargar proyectos Fase2/Fase3:', err);
      },
    });
  }
  // -------------------------------------------
  //   VER DETALLE -> CARGAR EN EL FORM
  // -------------------------------------------
  verDetalle: boolean = false;
  //codigo_proyecto numero_resolucion

  codigo_proyecto: any = null;
  numero_resolucion: any = null;
  // Control de estados y modos
  editMode: boolean = false; // Controla si el formulario está habilitado para edición
  proyectoSeleccionado: any = null; // Almacena el proyecto en detalle
  estadoProyecto: string = 'enviado'; // 🔹 Estado inicial
  misArchivosFase: any[] = [];

  verDetalleProyecto(proyecto: any): void {
    console.log('Proyecto seleccionado:', proyecto); // Verifica si se recibe el proyecto correctamente

    this.verDetalle = true;

    // Guardar el proyecto seleccionado (para mostrar su estado)
    this.proyectoSeleccionado = proyecto;
    this.estadoProyecto = proyecto.estado; // "enviado", "correcciones", etc.
    console.log(this.estadoProyecto);
    // 1. Llamar backend para obtener detalle (si hace falta)
    this.convocatoriaService.obtenerDetalleProyecto(proyecto.id).subscribe({
      next: (response) => {
        const data = response.proyecto;
        console.log('ver detalle ', data);
        // Parchear datos al form
        this.cargarFormularioConDatos(data);
        this.codigo_proyecto = data.codigo_proyecto;
        this.numero_resolucion = data.numero_resolucion;

        // 2. Cargar archivos de la fase "Presentación de Propuestas"
        //    (o si ya viene en data.archivos, filtrar)
        this.misArchivosFase =
          data.archivos?.filter(
            (a: any) => a.fase?.nombre === 'Cierre de Proyectos de Vinculación'
          ) || [];

        // 3. Si el estado es "correcciones", permitir "Corregir"
        console.log(data.estado);
        console.log(data.estado_fase);
        this.editMode = data.estado === 'correcciones' && data.fase === 'Fase3';
        console.log(this.editMode);
      },
      error: (err) => {
        console.error('Error al obtener detalle del proyecto:', err);
      },
    });
  }
  corregirProyecto(): void {
    // Permitir edición de campos
    this.editMode = true;
    this.toggleFormFields(true);
  }
  cargandoDatos: boolean = false;
  projectForm: FormGroup;

  // Estudiantes
  get estudiantes(): FormArray {
    return this.projectForm.get('estudiantes') as FormArray;
  }

  cargarFormularioConDatos(data: any): void {
    // Activar flag al iniciar la carga de datos
    this.cargandoDatos = true;

    // Limpia el arreglo de estudiantes
    this.estudiantes.clear();
    // 2. Extraer estudiantes
    const estudiantesMiembros =
      data.miembros?.filter((m: any) => m.role === 'estudiante') || [];
    const estudiantesData = estudiantesMiembros.map(
      (miembro: any) => miembro.detalles
    );
    console.log('Estudiantes extraídos:', estudiantesData); // Verifica si realmente se están extrayendo estudiantes
    console.log(data.resumen);
    this.projectForm.patchValue({ resumen: data.resumen || '' });

    // 6. Llenar el FormArray de estudiantes
    estudiantesData.forEach((est: any) => {
      const estudianteForm = this.fb.group({
        nombre: [est?.nombre || '', Validators.required],
        apellido: [est?.apellido || '', Validators.required],
        cedula: [est?.cedula || '', Validators.required],
        genero: [est?.genero || '', Validators.required],
        correo: [est?.correo || '', [Validators.required, Validators.email]],
        nota_docente: [
          est?.nota_docente || '',
          [Validators.required, Validators.min(1), Validators.max(10)],
        ],
      });
      this.estudiantes.push(estudianteForm);
    });

    // 7. Habilitar o deshabilitar el formulario según el modo de edición
    this.toggleFormFields(!this.editMode);

    // Desactivar flag una vez finalizada la carga
    this.cargandoDatos = false;
  }
  toggleFormFields(enable: boolean): void {
    if (enable) {
      this.projectForm.enable(); // Habilita todos los campos
    } else {
      this.projectForm.disable(); // Deshabilita todos los campos
    }
  }

  /**
   * Ver Observaciones de un proyecto
   */
  verObservaciones(proyecto: any): void {
    this.proyectoConObservaciones = proyecto;
    this.proyectosService.getObservacionesProyecto(proyecto.id).subscribe({
      next: (response) => {
        // Ajusta según la estructura de tu respuesta
        this.observaciones = response.observaciones || [];
        this.modalObservacionesVisible = true;
      },
      error: (err) => {
        console.error('Error al obtener observaciones:', err);
        this.mostrarToast(
          '❌ Error al obtener observaciones del proyecto.',
          false
        );
      },
    });
  }
  cerrarModalObservaciones(): void {
    this.modalObservacionesVisible = false;
    this.observaciones = [];
    this.proyectoConObservaciones = null;
  }
  /**
   * Muestra toast
   */
  mostrarToast(mensaje: string, exito: boolean): void {
    this.enviadoCorrectamente = exito;
    this.toastMessage = mensaje;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  /**
   * Carga los archivos de la fase "Avance de Proyectos de Vinculación" (Fase2) a nivel global
   * @param convocatoriaId ID de la convocatoria
   */
  cargarArchivosFase3(convocatoriaId: string): void {
    // Ajusta según tu servicio:
    this.convocatoriaService
      .obtenerFaseConvocatoriaPorNombre(
        convocatoriaId,
        'Cierre de Proyectos de Vinculación'
      )
      .subscribe({
        next: (faseData) => {
          const faseId = faseData.id;
          // Llamar a tu método que lista archivos de la fase
          this.convocatoriaService.obtenerArchivosFase(faseId).subscribe({
            next: (archivos) => {
              this.archivosFase3 = archivos;
            },
            error: (err) => {
              console.error('Error al cargar archivos de Fase2:', err);
            },
          });
        },
        error: (err) => {
          console.error('Error al obtener Fase2:', err);
        },
      });
  }

  descargarArchivo(archivo: any): void {
    // archivo.file_data es la cadena en base64
    // archivo.mime_type es, por ejemplo, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // archivo.titulo es el nombre original

    // Decodificar base64 a binario
    const byteCharacters = atob(archivo.file_data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Crear Blob
    const blob = new Blob([byteArray], { type: archivo.mime_type });

    // Crear URL de descarga
    const blobUrl = URL.createObjectURL(blob);

    // Crear elemento <a> y simular clic para descargar
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = archivo.titulo;
    a.click();

    // Liberar URL
    URL.revokeObjectURL(blobUrl);
  }
  //region enviar archivos
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const maxSize = 100 * 1024 * 1024; // 100 MB

      this.archivos = Array.from(input.files).filter((file) => {
        if (!allowedTypes.includes(file.type)) {
          console.error(`Tipo de archivo no permitido: ${file.name}`);
          return false;
        }
        if (file.size > maxSize) {
          console.error(`Archivo demasiado grande: ${file.name}`);
          return false;
        }
        return true;
      });
    }
  }
  //endregion

  //region vaidar nota
  notaInvalida: boolean = false;
  validateNota(event: any) {
    const value = event.target.value;

    // Validar si el valor está entre 1 y 10 y tiene hasta dos decimales
    const isValid =
      /^\d*(\.\d{0,2})?$/.test(value) && value >= 1 && value <= 10;

    if (!isValid) {
      this.notaInvalida = true;
      // Si no es válido, borrar el contenido
      event.target.value = '';
    } else {
      this.notaInvalida = false;
    }
  }
  //endregion
  ngOnDestroy(): void {
    // Limpiar el estado del ID de convocatoria al salir del componente
    this.navigationStateService.setConvocatoriaId(null);
  }
}
