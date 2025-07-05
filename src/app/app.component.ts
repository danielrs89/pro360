import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private router: Router) {}
  /**
   * Verifica si la ruta actual es la raíz ('/').
   * Útil para mostrar una vista diferente en la página de inicio.
   *
   * @returns {boolean} `true` si está en la ruta raíz, `false` en caso contrario.
   */
  get isRootPath(): boolean {
    return this.router.url === '/';
  }
}
