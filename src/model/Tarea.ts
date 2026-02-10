import { Categoria } from './Categoria';
import { Solicitud } from './Solicitud';

export class Tarea {
    id!: number;
    fechaPublicacion!: string; // Usamos string para facilitar el manejo con inputs de fecha
    fechaFin!: string;
    descripcion!: string;
    direccion!: string;
    precioMax!: number;
    
    // Relación con Categoria (Un objeto completo)
    categoria!: Categoria;
    
    // Lista de solicitudes (Inicializada vacía para evitar errores de undefined)
    solicitudes: Solicitud[] = [];
}