// src/app/models/message.model.ts

export interface ActorShort {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    rol: string;
}

export interface Mensaje {
    id: number;
    asunto: string;
    cuerpo: string;
    fechaEnvio: string; 
    remitente: ActorShort;
    destinatario: ActorShort;
}

export interface EnviarMensajeDTO {
    usernameDestinatario: string;
    asunto: string;
    cuerpo: string;
}