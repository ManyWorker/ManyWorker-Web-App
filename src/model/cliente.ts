import { Actor } from "./actor";
import { Tarea } from "./Tarea";

export interface Cliente extends Actor {
  tareas?: Tarea[];
}