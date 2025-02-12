export interface Archivo {
  id?: number;
  titulo: string;
  file_path: string;
  mime_type?: string;
  // url?: string;
}

// export interface Convocatoria {
//   id?: number;
//   titulo: string;
//   descripcion: string;
//   fecha_inicio: string;
//   fecha_fin: string;
//   archivos?: Archivo[];
//   estado: string;
// }



export interface FaseConvocatoria {
  id?: number;
  nombre: string;
  estado: boolean;
  resumen?: string;
  fecha_inicio: string;
  fecha_fin: string;
  // archivos?: any[]; // si quisieras tipar archivos de fase
}

export interface Convocatoria {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado?: string;
  archivos?: any[]; // ya existía
  fases?: FaseConvocatoria[]; // <-- Agrega esta propiedad
}
