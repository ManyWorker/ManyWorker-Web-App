export interface Tarea {
    id: number;
    contenido: string; // O 'descripcion', ajusta según tu backend
    precioBase: number; // Suponiendo que tiene precio
    tiempoEstimado: number; 
    // Si la tarea pertenece a una categoría:
    categoriaId?: number; 
}