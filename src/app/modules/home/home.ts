import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para *ngFor
import { RouterModule } from '@angular/router'; // Importante para routerLink

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  categories: any[] = [];
  featuredTutorials: any[] = [];

  constructor() { }

  ngOnInit(): void {
    // Datos simulados para Categorías
    this.categories = [
      { title: 'Fontanería', icon: 'bi-droplet-fill' },
      { title: 'Electricidad', icon: 'bi-lightning-charge-fill' },
      { title: 'Carpintería', icon: 'bi-hammer' },
      { title: 'Pintura', icon: 'bi-paint-bucket' },
      { title: 'Jardinería', icon: 'bi-flower1' },
      { title: 'Limpieza', icon: 'bi-stars' }
    ];

    // Datos simulados para Tutoriales
    this.featuredTutorials = [
      {
        title: 'Cómo cambiar un grifo de cocina',
        summary: 'Guía paso a paso para sustituir tu grifo antiguo sin herramientas complejas.',
        author: 'Juan M.',
        date: new Date('2025-10-15'),
        duration: '10:05'
      },
      {
        title: 'Reparar enchufe suelto',
        summary: 'Aprende a fijar enchufes de pared de forma segura y evitar cortocircuitos.',
        author: 'Ana Elec',
        date: new Date('2025-11-02'),
        duration: '05:30'
      },
      {
        title: 'Pintar una habitación como un pro',
        summary: 'Trucos de encintado y rodillo para un acabado perfecto en tus paredes.',
        author: 'Carlos P.',
        date: new Date('2025-12-20'),
        duration: '15:20'
      }
    ];
  }
}