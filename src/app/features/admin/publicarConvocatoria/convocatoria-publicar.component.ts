import { Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConvocatoriaService } from '../../../services/Convocatoria/convocatoria.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Convocatoria } from '../../../models/convocatoria.model';
@Component({
  selector: 'app-convocatoria-crear',
  templateUrl: './convocatoria-publicar.component.html',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ConvocatoriaCrearComponent implements OnInit {
  @ViewChildren('fileInputs') fileInputs!: QueryList<any>;
  private router = inject(Router);
  convocatoriaForm: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';
  mensajeAdvertencia: string = '';
  cargando: boolean = false;
  archivos: File[] = [];

  modoEdicion: boolean = false;
  convocatoriaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private convocatoriaService: ConvocatoriaService,
    private route: ActivatedRoute
  ) {
    this.convocatoriaForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(255)]],
      descripcion: ['', [Validators.required]],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      fases: this.fb.array([]),
    });

    // this.agregarFasesIniciales();
  }

  ngOnInit(): void {
    // Si el id existe, estamos en modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.cargarConvocatoria(+id); // Convertir id a number
    } else {
      this.isEdit = false;
      this.agregarFasesIniciales(); // Como ya tienes en el constructor, puede mantenerse así
    }
    this.listarConvocatorias();
    console.log("Listar convoc");
    this.canCretateCovocatoria();
  }

  isEdit = false;

  cargarConvocatoria(id: number) {
    this.convocatoriaService.getConvocatoriaById(id).subscribe({
      next: (convocatoria) => {
        this.convocatoriaForm.patchValue({
          titulo: convocatoria.titulo,
          descripcion: convocatoria.descripcion,
          fecha_inicio: convocatoria.fecha_inicio,
          fecha_fin: convocatoria.fecha_fin,
        });

        if (convocatoria.fases && Array.isArray(convocatoria.fases)) {
          this.fases.clear();
          convocatoria.fases.forEach((fase) => {
            this.fases.push(
              this.fb.group({
                id: [fase.id], // <-- Incluimos el id para identificar la fase
                nombre: [fase.nombre, Validators.required],
                estado: [fase.estado],
                resumen: [fase.resumen ?? ''],
                fecha_inicio: [fase.fecha_inicio, Validators.required],
                fecha_fin: [fase.fecha_fin, Validators.required],
                archivos: [[]], // Si deseas cargar o administrar archivos, ajusta este campo
              })
            );
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar convocatoria:', err);
      },
    });
  }

  establecerFases(fasesBD: any[]): void {
    // Limpia el FormArray actual
    this.fases.clear();

    fasesBD.forEach((fase) => {
      // "fase" debe contener campos: nombre, estado, resumen, fecha_inicio, fecha_fin, archivos...
      this.fases.push(
        this.fb.group({
          nombre: [fase.nombre, Validators.required],
          estado: [fase.estado],
          resumen: [fase.resumen],
          fecha_inicio: [fase.fecha_inicio, Validators.required],
          fecha_fin: [fase.fecha_fin, Validators.required],
          archivos: [[]], // en caso de querer cargar los "archivos" ya existentes
        })
      );
    });
  }

  onFileChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const nuevos = Array.from(files) as File[];
      nuevos.forEach((archivo) => {
        // Validar que el tamaño del archivo no exceda 5MB (5 * 1024 * 1024 bytes)
        if (archivo.size > 10 * 1024 * 1024) {
          this.mensajeError = `El archivo ${archivo.name} supera el límite de 10MB.`;
          return; // O bien, podrías usar continue si estás dentro de un loop for clásico
        }
        // Verificar duplicados basados en nombre y tamaño
        const yaExiste = this.archivos.some(
          (a) => a.name === archivo.name && a.size === archivo.size
        );
        if (!yaExiste) {
          this.archivos.push(archivo);
        }
      });
    }
  }

  onDropFase(event: DragEvent, faseIndex: number): void {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const nuevos = Array.from(files) as File[];
      const fase = this.fases.at(faseIndex);
      const archivosActuales = fase.get('archivos')?.value || [];

      fase.patchValue({
        archivos: [...archivosActuales, ...nuevos],
      });
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const nuevos = Array.from(files).map((file) => file as File); // <- Convertir a tipo File
      nuevos.forEach((archivo) => {
        const yaExiste = this.archivos.some(
          (a) => a.name === archivo.name && a.size === archivo.size
        );
        if (!yaExiste) {
          this.archivos.push(archivo);
        }
      });
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  get fases(): FormArray {
    return this.convocatoriaForm.get('fases') as FormArray;
  }

  agregarFasesIniciales(): void {
    const fasesIniciales = [
      { nombre: 'Presentación de Propuestas', estado: true },
      { nombre: 'Avance de Proyectos de Vinculación', estado: false },
      { nombre: 'Cierre de Proyectos de Vinculación', estado: false },
    ];

    fasesIniciales.forEach((fase) => {
      this.fases.push(
        this.fb.group({
          nombre: [fase.nombre, Validators.required],
          estado: [fase.estado],
          resumen: [''],
          fecha_inicio: ['', Validators.required],
          fecha_fin: ['', Validators.required],
          archivos: [[]],
        })
      );
    });
  }

  onFileChangeFase(event: any, faseIndex: number): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      const nuevos = Array.from(files) as File[];
      const fase = this.fases.at(faseIndex);
      const archivosActuales = fase.get('archivos')?.value || [];
      fase.patchValue({
        archivos: [...archivosActuales, ...nuevos],
      });
    }
  }

  validarFechas(): boolean {
    const fechaInicioConvocatoria = new Date(
      this.convocatoriaForm.get('fecha_inicio')?.value
    );
    const fechaFinConvocatoria = new Date(
      this.convocatoriaForm.get('fecha_fin')?.value
    );

    if (fechaFinConvocatoria < fechaInicioConvocatoria) {
      this.mensajeAdvertencia =
        'La fecha de fin de la convocatoria no puede ser antes de la fecha de inicio.';
      return false;
    }

    let prevFechaFin: Date | null = null;

    for (let i = 0; i < this.fases.length; i++) {
      const fase = this.fases.at(i).value;
      const fechaInicioFase = new Date(fase.fecha_inicio);
      const fechaFinFase = new Date(fase.fecha_fin);

      if (
        fechaInicioFase < fechaInicioConvocatoria ||
        fechaFinFase > fechaFinConvocatoria
      ) {
        this.mensajeAdvertencia = `Las fechas de la fase "${fase.nombre}" deben estar dentro del período de la convocatoria.`;
        return false;
      }

      if (fechaFinFase < fechaInicioFase) {
        this.mensajeAdvertencia = `La fecha de fin de la fase "${fase.nombre}" no puede ser antes de su fecha de inicio.`;
        return false;
      }

      if (prevFechaFin && fechaInicioFase < prevFechaFin) {
        this.mensajeAdvertencia = `La fase "${fase.nombre}" debe comenzar después de la fase anterior.`;
        return false;
      }

      prevFechaFin = fechaFinFase;
    }

    this.mensajeAdvertencia = '';
    return true;
  }

  guardarConvocatoria(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.mensajeAdvertencia = '';

    // Validar Fechas
    if (!this.validarFechas()) {
      return;
    }

    // Validar que todas las fases tengan al menos un archivo
    for (let i = 0; i < this.fases.length; i++) {
      const fase = this.fases.at(i);
      const archivos = fase.get('archivos')?.value;
      if (!archivos || archivos.length === 0) {
        this.mensajeAdvertencia = `La fase "${
          fase.get('nombre')?.value
        }" debe contener al menos un archivo.`;
        return;
      }
    }

    if (this.convocatoriaForm.valid) {
      this.cargando = true;

      if (this.isEdit) {
        // Armar un objeto JSON sin archivos
        const data = {
          titulo: this.convocatoriaForm.get('titulo')?.value,
          descripcion: this.convocatoriaForm.get('descripcion')?.value,
          fecha_inicio: this.convocatoriaForm.get('fecha_inicio')?.value,
          fecha_fin: this.convocatoriaForm.get('fecha_fin')?.value,
          fases: this.fases.value, // array de fases sin archivos
        };

        // Suponiendo que guardamos el ID en una variable "idConvocatoria"
        const idConv = this.route.snapshot.paramMap.get('id'); // string
        const idNum = idConv ? +idConv : null;

        if (idNum) {
          this.convocatoriaService.editarConvocatoria(idNum, data).subscribe({
            next: () => {
              this.cargando = false;
              this.mensajeExito = 'Convocatoria actualizada exitosamente!';
              this.router.navigate(['/panel/convocatorias']);
            },
            error: (error) => {
              this.cargando = false;
              this.mensajeError = `Error al actualizar la convocatoria: ${error.error.message}`;
            },
          });
        }
      } else {
        // Crear Convocatoria (con archivos)
        // Reusa tu lógica existente con FormData
        const formData = new FormData();
        formData.append('titulo', this.convocatoriaForm.get('titulo')?.value);
        formData.append(
          'descripcion',
          this.convocatoriaForm.get('descripcion')?.value
        );
        formData.append(
          'fecha_inicio',
          this.convocatoriaForm.get('fecha_inicio')?.value
        );
        formData.append(
          'fecha_fin',
          this.convocatoriaForm.get('fecha_fin')?.value
        );

        // Adjuntar archivos generales de la convocatoria
        this.archivos.forEach((archivo, index) => {
          formData.append(`files[${index}]`, archivo);
        });

        // Adjuntar las fases y sus archivos
        this.fases.controls.forEach((faseControl, i) => {
          const fase = faseControl.value;
          formData.append(`fases[${i}][nombre]`, fase.nombre);
          formData.append(`fases[${i}][estado]`, String(fase.estado));
          formData.append(`fases[${i}][resumen]`, fase.resumen);
          formData.append(`fases[${i}][fecha_inicio]`, fase.fecha_inicio);
          formData.append(`fases[${i}][fecha_fin]`, fase.fecha_fin);

          if (fase.archivos && fase.archivos.length > 0) {
            fase.archivos.forEach((archivo: File, j: number) => {
              formData.append(`fases[${i}][archivos][]`, archivo);
            });
          }
        });

        this.convocatoriaService.guardarConvocatoria(formData).subscribe({
          next: () => {
            this.cargando = false;
            this.convocatoriaForm.reset();
            this.archivos = [];
            this.mensajeExito = 'Convocatoria guardada exitosamente!';
          },
          error: (error) => {
            this.cargando = false;
            this.mensajeError = `Error al guardar la convocatoria: ${error.error.message}`;
          },
        });
      }
    } else {
      this.mensajeAdvertencia =
        'Por favor, completa todos los campos correctamente.';
    }
  }
  convocatorias: any[] = [];

  listarConvocatorias(): void {
    this.convocatoriaService.listarConvocatorias().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.convocatorias = response;
          console.log(this.convocatorias);
        } else {
          console.error('Datos de convocatorias no válidos:', response);
          this.convocatorias = [];
        }
      },
      error: (err) => {
        console.error('Error al listar convocatorias:', err);
      },
    });
  }

  public canCretateCovocatoria(): boolean {
    console.log('funcionar');
        if (
          this.convocatorias &&
          this.convocatorias.length > 0
        ) {
          // se permite crear uno nuevo solo si TODOS están finalizados
          if (this.convocatorias.length > 0) {
            const proyectosActivos = this.convocatorias.filter(
              (c) => c.estado !== 'finalizado'
            );
            console.log(proyectosActivos.length === 0);
            return proyectosActivos.length === 0;
          }
        }
    return true;
  }

}
