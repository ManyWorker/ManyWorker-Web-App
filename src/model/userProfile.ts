export interface UserProfile {
  id: number;
  nombre: string;
  apellido: string;
  apellido2?: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  foto?: string;
  rol: 'ADMINISTRADOR' | 'CLIENTE' | 'TRABAJADOR';
  
  // Campos específicos de Trabajador
  nombreComercial?: string; 
  descripcion?: string;
  
  // Campos de auditoría (opcionales para el formulario)
  version?: number;
}