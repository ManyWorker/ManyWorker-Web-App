import { Tarea } from './Tarea';

export interface Solicitud {
    id: number;
    fechaSolicitud: string; // O Date
    aceptado: boolean;
    trabajadorId: number; // ID del trabajador
    clienteId: number;    // ID del cliente
    tarea: Tarea;         // La tarea solicitada
}