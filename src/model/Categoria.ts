import { Tarea } from './Tarea';

export interface Categoria {
    id?: number;              
    titulo: string;
    leyesAplicables: string;
    esReparacion?: boolean;    
}