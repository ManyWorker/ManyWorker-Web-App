export interface Solicitud {
    id: number;
    precioOfrecido: number;     
    comentario: string;         
    estado?: string;
    fechaRegistro?: string;
    
    trabajador?: { id: number }; 
    tarea?: any; 
}