import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConvocatoriaService } from '../../../../services/Convocatoria/convocatoria.service';
import { NavigationStateService } from '../../../../services/navigation-state.service';
import { CommonModule } from '@angular/common';
import { ArchivoService } from '../../../../services/ConvocatoriaArchivoService/archivo.service';
import { ProyectosService } from '../../../../services/convocatoriaProyectos/proyectos.service';

@Component({
  selector: 'app-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css'],
})
export class ProyectoComponent implements OnInit, OnDestroy {
  projectForm: FormGroup;
  archivos: File[] = [];
  convocatoriaId: string | null = null;
  estadoProyecto: string = 'enviado'; // 🔹 Estado inicial
  toastMessage: string = '';
  showToast: boolean = false;

  proyectos: any[] = []; // Se llenará en ngOnInit con los proyectos existentes

  // Control de estados y modos
  editMode: boolean = false; // Controla si el formulario está habilitado para edición
  proyectoSeleccionado: any = null; // Almacena el proyecto en detalle

  constructor(
    private fb: FormBuilder,
    private convocatoriaService: ConvocatoriaService,
    private route: ActivatedRoute,
    private navigationStateService: NavigationStateService,
    private archivoService: ArchivoService,
    private cdr: ChangeDetectorRef,
    private proyectosService: ProyectosService
  ) {
    this.projectForm = this.fb.group({
      convocatoria_id: ['', Validators.required],
      nombre: ['', Validators.required],
      dominio: ['', Validators.required],
      fasePresentacion: ['', Validators.required],
      fase: [''],
      docente_coordinador: this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        cedula: ['', Validators.required],
        telefono: ['', Validators.required],
        correo: ['', [Validators.required, Validators.email]],
      }),
      institucion_beneficiaria: ['', Validators.required],
      canton: ['', Validators.required],
      parroquia: ['', Validators.required],
      oferta_academica: ['', Validators.required],
      facultad: ['', Validators.required],
      carrera: ['', Validators.required],
      modalidad: ['', Validators.required],
      estudiantes: this.fb.array([]), // FormArray para estudiantes
    });
  }

  archivosFase: any[] = [];
  misArchivosFase: any[] = [];

  descargarArchivoFase(archivoId: number): void {
    this.archivoService.descargarArchivoFase(archivoId);
  }
  ngOnInit(): void {
    // 2. Cargar proyectos existentes del profesor
    // (Asumiendo que hay un endpoint o método para ello)
    this.cargarProyectosDelProfesor();
    this.canCreateProject();

    // Al cambiar la facultad, actualizamos las carreras disponibles y reseteamos la carrera elegida
    // Suscribirse al cambio de la facultad usando projectForm
    this.projectForm
      .get('facultad')
      ?.valueChanges.subscribe((selectedFacultadNombre) => {
        const facultadSeleccionada = this.facultades.find(
          (f) => f.nombre === selectedFacultadNombre
        );
        this.carrerasDisponibles = facultadSeleccionada
          ? facultadSeleccionada.carreras
          : [];
        // Reseteamos el control "carrera" del projectForm
        this.projectForm.get('carrera')?.setValue('');
      });

    // Obtener el ID de la convocatoria desde la URL
    this.convocatoriaId = this.route.snapshot.paramMap.get('id');
    if (this.convocatoriaId) {
      this.projectForm.patchValue({ convocatoria_id: this.convocatoriaId });
      this.navigationStateService.setConvocatoriaId(this.convocatoriaId);
      // Obtener el estado del proyecto desde el backend
      // this.obtenerEstadoProyecto();

      // 🔹 Obtener la fase "Presentación de Propuestas"
      this.convocatoriaService
        .obtenerFaseConvocatoriaPorNombre(
          this.convocatoriaId,
          'Presentación de Propuestas'
        )
        .subscribe({
          next: (fase: any) => {
            const faseId = fase.id;
            this.convocatoriaService.obtenerArchivosFase(faseId).subscribe({
              next: (archivos: any[]) => {
                this.archivosFase = archivos;
                console.log(this.archivosFase);
              },
              error: (err: any) => {
                // Se declara el tipo any
                console.error('Error al obtener archivos de la fase:', err);
              },
            });
          },
          error: (err: any) => {
            // Se declara el tipo any
            console.error(
              'Error al obtener la fase de Presentación de Propuestas:',
              err
            );
          },
        });
    }
    this.agregarEstudiante(); // Agregar un estudiante por defecto
  }

  // Lista de facultades con sus carreras
  facultades = [
    {
      nombre:
        'Facultad de Ciencias Administrativas, Gestión Empresarial e Informática',
      carreras: [
        'Contabilidad y Auditoría',
        'Comunicación',
        'Turismo y Hotelería',
        'Software',
        'Mercadotecnia',
        'Administración de Empresas',
        'Emprendimiento e Innovación Social',
        'Tecnologías de la Información',
        'Marketing Digital',
        'Contabilidad y Auditoría (Híbrida)',
        'Administración de Empresas (Híbrida)',
      ],
    },
    {
      nombre: 'Facultad de Jurisprudencia, Ciencias Sociales y Políticas',
      carreras: ['Derecho', 'Sociología'],
    },
    {
      nombre:
        'Facultad de Ciencias de la Educación, Sociales, Filosóficas y Humanísticas',
      carreras: [
        'Educación Intercultural Bilingüe',
        'Educación Inicial',
        'Pedagogía de la Informática',
        'Educación Básica',
        'Pedagogía de la Matemática y La Física',
        'Pedagogía De Los Idiomas Nacionales Y Extranjeros',
      ],
    },
    {
      nombre:
        'Facultad de Ciencias Agropecuarias, Recursos Naturales y del Ambiente',
      carreras: ['Medicina Veterinaria', 'Agronomía', 'Agroindustria'],
    },
    {
      nombre: 'Facultad de Ciencias de la Salud y del Ser Humano',
      carreras: ['Enfermería', 'Riesgos de Desastres', 'Terapia Física'],
    },
    {
      nombre: 'Extensión Universitaria de San Miguel',
      carreras: ['Talento Humano', 'Criminalística'],
    },
  ];

  // Lista de carreras disponibles en función de la facultad seleccionada
  carrerasDisponibles: string[] = [];

  ngOnDestroy(): void {
    this.navigationStateService.setConvocatoriaId(null); // Limpiar el ID en el servicio
  }

  // -------------------------------------------
  //   CARGAR PROYECTOS CREADOS (fase presentación)
  // -------------------------------------------
  cargarProyectosDelProfesor(): void {
    // Ajusta el servicio y endpoint a tu realidad.
    // Se filtra por:
    // - El profesor logueado (o su ID)
    // - Fase "Presentación de Propuestas" (opcional)
    this.convocatoriaService.obtenerProyectosDelProfesor().subscribe({
      next: (response) => {
        this.proyectos = response.proyectos; // Ajusta al formato de tu backend
      },
      error: (err) =>
        console.error('Error al cargar proyectos del profesor:', err),
    });
  }
  // Función para determinar si se permite crear un nuevo proyecto en la convocatoria actual
  public canCreateProject(): boolean {
    if (this.proyectos && this.proyectos.length > 0 && this.convocatoriaId) {
      // Filtrar los proyectos que pertenecen a la convocatoria actual
      // Si existen proyectos en la convocatoria actual,
      // se permite crear uno nuevo solo si TODOS están finalizados
      if (this.proyectos.length > 0) {
        const proyectosActivos = this.proyectos.filter(
          (p) => p.estado !== 'finalizado'
        );
        console.log(proyectosActivos.length === 0);
        return proyectosActivos.length === 0;
      }
    }
    return true;
  }

  // -------------------------------------------
  //   VER DETALLE -> CARGAR EN EL FORM
  // -------------------------------------------
  verDetalleProyecto(proyecto: any): void {
    // Guardar el proyecto seleccionado (para mostrar su estado)
    this.proyectoSeleccionado = proyecto;
    this.estadoProyecto = proyecto.estado; // "enviado", "correcciones", etc.
    console.log(this.estadoProyecto);
    // 1. Llamar backend para obtener detalle (si hace falta)
    this.convocatoriaService.obtenerDetalleProyecto(proyecto.id).subscribe({
      next: (response) => {
        const data = response.proyecto;
        console.log(data);
        // Parchear datos al form
        this.cargarFormularioConDatos(data);

        // 2. Cargar archivos de la fase "Presentación de Propuestas"
        //    (o si ya viene en data.archivos, filtrar)
        this.misArchivosFase =
          data.archivos?.filter(
            (a: any) => a.fase?.nombre === 'Presentación de Propuestas'
          ) || [];

        // 3. Si el estado es "correcciones", permitir "Corregir"
        console.log(data.estado);
        console.log(data.estado_fase);
        this.editMode = data.estado === 'correcciones' && data.fase === 'Fase1';
        console.log(this.editMode);
      },
      error: (err) => {
        console.error('Error al obtener detalle del proyecto:', err);
      },
    });
  }

  // -------------------------------------------
  //   TOGGLE FORM (CORREGIR O READ-ONLY)
  // -------------------------------------------
  cargarFormularioConDatos(data: any): void {
    // Limpia arreglo de estudiantes
    this.estudiantes.clear();

    // ======================================
    // 1. Buscar Docente Coordinador en "miembros"
    // ======================================
    // El docente coordinador se identifica con el rol "profesor" (o "coordinador", según tu DB)
    const docenteMiembro = data.miembros?.find(
      (m: any) => m.role === 'profesor'
    );

    // datos del docente (pueden provenir de m.detalles)
    const docenteDatos = docenteMiembro?.detalles || {};

    // ======================================
    // 2. Extraer Estudiantes
    // ======================================
    // Filtra miembros con rol "estudiante"
    const estudiantesMiembros =
      data.miembros?.filter((m: any) => m.role === 'estudiante') || [];

    // Cada miembro de rol estudiante también tiene su info en la propiedad "detalles"
    const estudiantesData = estudiantesMiembros.map(
      (miembro: any) => miembro.detalles
    );

    // ======================================
    // 3. Parchear campos base del proyecto
    // ======================================
    this.projectForm.patchValue({
      convocatoria_id: data.convocatoria_id || '',
      nombre: data.nombre || '',
      dominio: data.dominio || '',
      fasePresentacion: data.fasePresentacion || '',
      institucion_beneficiaria: data.institucion_beneficiaria || '',
      canton: data.canton || '',
      parroquia: data.parroquia || '',
      oferta_academica: data.oferta_academica || '',
      facultad: data.facultad || '',
      carrera: data.carrera || '',
      modalidad: data.modalidad || '',

      // Docente Coordinador (si no existe, se asignan cadenas vacías)
      docente_coordinador: {
        nombre: docenteDatos.nombre || '',
        apellido: docenteDatos.apellido || '',
        cedula: docenteDatos.cedula || '',
        telefono: docenteDatos.telefono || '',
        correo: docenteDatos.correo || '',
      },
    });

    // ======================================
    // 4. Llenar FormArray de Estudiantes
    // ======================================
    // cada "est" de estudiantesData tiene {nombre, apellido, cedula, genero, correo}
    estudiantesData.forEach((est: any) => {
      const estudianteForm = this.fb.group({
        nombre: [est?.nombre || '', Validators.required],
        apellido: [est?.apellido || '', Validators.required],
        cedula: [est?.cedula || '', Validators.required],
        genero: [est?.genero || '', Validators.required],
        correo: [est?.correo || '', [Validators.required, Validators.email]],
      });
      this.estudiantes.push(estudianteForm);
    });

    // ======================================
    // 5. Habilitar/deshabilitar el formulario según editMode
    // ======================================
    this.toggleFormFields(!this.editMode);
  }

  toggleFormFields(enable: boolean): void {
    if (enable) {
      this.projectForm.enable(); // Habilita todos los campos
    } else {
      this.projectForm.disable(); // Deshabilita todos los campos
    }
  }

  // -------------------------------------------
  //   BOTÓN "CORREGIR"
  // -------------------------------------------
  corregirProyecto(): void {
    // Permitir edición de campos
    this.editMode = true;
    this.toggleFormFields(true);
  }

  // Estudiantes
  get estudiantes(): FormArray {
    return this.projectForm.get('estudiantes') as FormArray;
  }

  agregarEstudiante(): void {
    const estudianteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cedula: ['', Validators.required],
      genero: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
    });
    this.estudiantes.push(estudianteForm);
  }

  eliminarEstudiante(index: number): void {
    this.estudiantes.removeAt(index);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const maxSize = 10 * 1024 * 1024; // 10 MB

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
  enviadoCorrectamente: boolean | null = null; // null = no enviado, true = éxito, false = error

  mostrarToast(mensaje: string, exito: boolean): void {
    this.enviadoCorrectamente = exito;
    this.toastMessage = mensaje;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
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

    // Si hay un proyectoSeleccionado con ID, vamos a actualizar
    if (this.proyectoSeleccionado && this.proyectoSeleccionado.id) {
      formData.append('proyecto_id', this.proyectoSeleccionado.id);
      this.actualizarProyecto(formData);
    } else {
      // Caso contrario, creamos uno nuevo
      this.crearProyecto(formData);
    }
  }

  private crearProyecto(formData: FormData): void {
    this.convocatoriaService.crearProyecto(formData).subscribe({
      next: () => {
        this.mostrarToast('✅ Proyecto registrado exitosamente.', true);
        this.estadoProyecto = 'en_revision';
        this.projectForm.reset();
        // Refrescar la lista o hacer lo necesario
        this.cargarProyectosDelProfesor();
        this.proyectoSeleccionado = null; // Ya no está seleccionando proyecto
        this.editMode = false;
      },
      error: () => {
        this.mostrarToast('❌ Error al registrar el proyecto.', false);
      },
    });
  }

  private actualizarProyecto(formData: FormData): void {
    this.convocatoriaService.actualizarProyecto(formData).subscribe({
      next: () => {
        this.mostrarToast('✅ Proyecto actualizado correctamente.', true);
        this.estadoProyecto = 'en_revision';
        this.projectForm.reset();
        this.cargarProyectosDelProfesor();
        this.proyectoSeleccionado = null;
        this.editMode = false;
      },
      error: () => {
        this.mostrarToast('❌ Error al actualizar el proyecto.', false);
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    formData.append('convocatoria_id', this.projectForm.value.convocatoria_id);
    formData.append('nombre', this.projectForm.value.nombre);
    formData.append('dominio', this.projectForm.value.dominio);
    formData.append('fase', 'Fase1');
    console.log(this.projectForm.value.fasePresentacion);
    formData.append(
      'fasePresentacion',
      this.projectForm.value.fasePresentacion
    );
    formData.append(
      'institucion_beneficiaria',
      this.projectForm.value.institucion_beneficiaria
    );
    formData.append('canton', this.projectForm.value.canton);
    formData.append('parroquia', this.projectForm.value.parroquia);
    formData.append(
      'oferta_academica',
      this.projectForm.value.oferta_academica
    );
    formData.append('facultad', this.projectForm.value.facultad);
    formData.append('carrera', this.projectForm.value.carrera);
    formData.append('modalidad', this.projectForm.value.modalidad);

    // Docente
    const docente = this.projectForm.value.docente_coordinador;
    formData.append('docente_coordinador[nombre]', docente.nombre);
    formData.append('docente_coordinador[apellido]', docente.apellido);
    formData.append('docente_coordinador[cedula]', docente.cedula);
    formData.append('docente_coordinador[correo]', docente.correo);
    formData.append('docente_coordinador[telefono]', docente.telefono);

    // Estudiantes
    const estudiantes = this.projectForm.value.estudiantes;
    estudiantes.forEach((est: any, index: number) => {
      formData.append(`estudiantes[${index}][nombre]`, est.nombre);
      formData.append(`estudiantes[${index}][apellido]`, est.apellido);
      formData.append(`estudiantes[${index}][cedula]`, est.cedula);
      formData.append(`estudiantes[${index}][genero]`, est.genero);
      formData.append(`estudiantes[${index}][correo]`, est.correo);
    });

    // Archivos
    this.archivos.forEach((file) => formData.append('archivos[]', file));
    return formData;
  }

  //region ver observaciones
  modalObservacionesVisible: boolean = false; // Controla la visibilidad del modal
  observaciones: any[] = []; // Almacena la lista de observaciones de un proyecto
  proyectoConObservaciones: any = null; // Guarda el proyecto para mostrar encabezado o identificar
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
}
