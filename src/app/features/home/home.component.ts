import { Component } from '@angular/core'
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currentSlide = 0; // Índice de la diapositiva actual
  sliderImages = [
    'https://www.ueb.edu.ec/images/vicerrectorado-investigacion/vinculacion/vinc3.jpg',
    'https://www.ueb.edu.ec/images/vicerrectorado-investigacion/vinculacion/dsc_2388.jpg',
    'https://www.ueb.edu.ec/images/Vinculacion/fotos/19_INVESTIGACIN_3.jpg',
  ];

  // Cambiar a la siguiente diapositiva
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
  }

  // Cambiar a la diapositiva anterior
  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.sliderImages.length) % this.sliderImages.length;
  }
  
  constructor(private router: Router) {}

  navigateToLogin() {
    // Redirige al componente de login
    this.router.navigate(['/login']);
  }
}
