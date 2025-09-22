import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CurrentStatus } from 'src/app/current-status';

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

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // Redirects
  redirectToPerfil() {
    if(CurrentStatus.DEBUG_MODE) console.log("[DASHBOARD_PAGE] Redirect to Perfil");
    this.router.navigate([ "/perfil" ]);
  }
  redirectToColegas() {
    if(CurrentStatus.DEBUG_MODE) console.log("[DASHBOARD_PAGE] Redirect to Colegas");
    this.router.navigate([ "/colegas" ]);
    //window.location.reload(); // Reload = Looks more responsive
    // TODO: (Dashboard) Trocar reload por re-route quando houver mais do que a página de Colegas
  }
  redirectToChat() {
    if(CurrentStatus.DEBUG_MODE) console.log("[DASHBOARD_PAGE] Redirect to Chat");
    this.router.navigate([ "/chat" ]);
  }
  redirectToLogout() {
    if(CurrentStatus.DEBUG_MODE) console.log("[DASHBOARD_PAGE] Redirect to Logout");
    this.router.navigate([ "/logout" ]);
  }

}
