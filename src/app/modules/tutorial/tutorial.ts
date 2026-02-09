import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialService } from '../../services/tutorial.service';
import { Tutorial } from '../../models/tutorial';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial.html'
})
export class TutorialComponent implements OnInit {
  tutoriales: Tutorial[] = [];

  constructor(private tutorialService: TutorialService) {}

  ngOnInit(): void {
    this.tutorialService.findAll().subscribe({
      next: (data) => this.tutoriales = data,
      error: (err) => console.error('Error al cargar tutoriales', err)
    });
  }
}