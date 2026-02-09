import { Tarea } from './Tarea';

export class Categoria {
    id!: number;
    titulo!: string;
    leyesAplicables!: string;
    esReparacion!: boolean;
    tareas: Tarea[] = []; // <--- Añadido: Lista de tareas
}