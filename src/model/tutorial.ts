import { Trabajador } from "./trabajador";

export interface Tutorial {
  id?: number;
  version?: number;

  titulo: string;
  
  fechaCreacion?: string;      
  fechaActualizacion?: string; 

  resumen: string;       

  imagenes?: string[];    

  texto: string;     

}