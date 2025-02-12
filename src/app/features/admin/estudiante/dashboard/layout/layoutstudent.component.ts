import { Component } from '@angular/core';
import { HeaderEstudianteComponent } from '../header/header-estudiante.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterEstudianteComponent } from '../footer/footer-estudiante.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layoutstudent',
  templateUrl: './layoutstudent.component.html',
  styleUrl: './layoutstudent.component.css',
  imports: [HeaderEstudianteComponent, SidebarComponent, FooterEstudianteComponent, RouterOutlet],
})
export class LayoutstudentComponent {

}
