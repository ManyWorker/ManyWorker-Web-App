import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule, DatePipe],
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