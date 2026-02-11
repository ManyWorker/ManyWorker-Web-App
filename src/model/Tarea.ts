import { Categoria } from './Categoria';
import { Solicitud } from './Solicitud';

export interface Tarea {
    id: number;
    
    // Campos que requiere el código de tus compañeros
    contenido?: string; 
    precioBase?: number;
    tiempoEstimado?: number;

    // Campos que usas tú
    descripcion: string;
    precioMax: number;
    direccion: string;
    fechaPublicacion?: string;
    fechaFin?: string;

    // Relaciones
    categoriaId?: number; 
    categoria?: Categoria;
    solicitudes?: Solicitud[];
}