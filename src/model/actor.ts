import { PerfilSocial } from "./PerfilSocial";

export interface Actor {
  id?: number;      
  version?: number;
  
  nombre: string;
  apellido: string;
  apellido2?: string;
  foto?: string;     
  correo: string;
  telefono?: string;
  direccion?: string;
  
  
  numeroPerfiles?: PerfilSocial[]; 
  
}