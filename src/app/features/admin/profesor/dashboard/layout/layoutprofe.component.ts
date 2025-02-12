import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { HeaderProfeComponent } from '../header/header-profe.component';
import { FooterProfeComponent } from '../footer/footer-profe.component';

@Component({
  selector: 'app-layoutprofe',
  templateUrl: './layoutprofe.component.html',
  styleUrl: './layoutprofe.component.css',
  imports: [HeaderProfeComponent, SidebarComponent, FooterProfeComponent, RouterOutlet],
})
export class LayoutprofeComponent {

}
