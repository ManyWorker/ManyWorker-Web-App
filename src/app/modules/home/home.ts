import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true, // Asegura que es standalone (aunque funciona sin ponerlo explícito en v17+, es buena práctica)
  imports: [CommonModule, DatePipe, RouterLink], // <--- IMPORTANTE: Añadir RouterLink aquí
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  // Categorías requeridas por el sistema
  categories = [
    { title: 'Carpintería', icon: 'bi-house' },
    { title: 'Fontanería', icon: 'bi-droplet' },
    { title: 'Pintura', icon: 'bi-brush' },
    { title: 'Cableado eléctrico', icon: 'bi-lightning' },
    { title: 'Limpieza', icon: 'bi-stars' },
    { title: 'Control de plagas', icon: 'bi-bug' }
  ];

  // Tutoriales de ejemplo
  featuredTutorials = [
    { 
      title: 'Cómo reparar una fuga de agua básica', 
      author: 'MasterFixer', 
      date: new Date(),
      summary: 'Aprende los pasos esenciales para sellar tuberías de PVC en casa.' 
    },
    { 
      title: 'Guía de seguridad en instalaciones eléctricas', 
      author: 'ElectroExpert', 
      date: new Date(),
      summary: 'Normas básicas y leyes aplicables para el cableado doméstico.' 
    }
  ];
}