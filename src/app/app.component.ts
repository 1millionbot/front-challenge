import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ComparacionCurricularComponent } from './components/comparacion-curricular/comparacion-curricular.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ComparacionCurricularComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}

