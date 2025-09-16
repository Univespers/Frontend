import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ RouterOutlet ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(
    private router: Router
  ) {}

  toLogout() {
    this.router.navigate([ "/logout" ]);
  }

  redirectToColegas() {
    // this.router.navigate([ "/colegas" ]);
    window.location.reload(); // Reload = Looks more responsive
    // TODO: (Dashboard) Trocar reload por re-route quando houver mais do que a página de Colegas
  }

}
