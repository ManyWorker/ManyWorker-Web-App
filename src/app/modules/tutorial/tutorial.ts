import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Importar ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { TutorialService } from '../../services/tutorial.service';
import { finalize } from 'rxjs/operators';
import { Tutorial } from '../../../model/tutorial';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tutorial.html',
  styleUrls: ['./tutorial.css']
})
export class TutorialComponent implements OnInit {

  tutoriales: Tutorial[] = [];
  cargando: boolean = true;
  errorMensaje: string = '';

  constructor(
    private tutorialService: TutorialService,
    private cd: ChangeDetectorRef // <--- 2. Inyectarlo aquí
  ) {}

  ngOnInit(): void {
    this.obtenerTutoriales();
  }

  obtenerTutoriales(): void {
    this.cargando = true; // Empieza a cargar
    
    // Forzamos detección al inicio para asegurar que salga el spinner
    this.cd.detectChanges(); 

    this.tutorialService.findAll()
      .pipe(
        finalize(() => {
          this.cargando = false; // <--- 3. Apagamos el flag
          this.cd.detectChanges(); // <--- 4. ¡OBLIGAMOS A ANGULAR A REPINTAR!
        })
      )
      .subscribe({
        next: (data) => {
          console.log('✅ Datos recibidos:', data);
          this.tutoriales = data || [];
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.errorMensaje = 'No se pudieron cargar los tutoriales.';
        }
      });
  }
}