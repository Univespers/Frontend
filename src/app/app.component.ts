import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService } from './features/auth/auth.service';
import { LoadingComponent } from './components/loading/loading.component';
import { CurrentStatus } from './current-status';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, FooterComponent, LoadingComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public title = 'Univespers';
  public isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.setupLoginManager();
  }

  // Login Manager
  setupLoginManager() {
    if(CurrentStatus.DEBUG_MODE) console.log("[APP] Call LoginManager");
    this.isLoading = true;
    this.authService.loginManager().subscribe(() => {
      this.isLoading = false;
      this.redirect();
    });
  }

  // Redirects
  redirect() {
    if(CurrentStatus.DEBUG_MODE) console.log("[APP] Redirect");
    this.router.navigate([ "/redirect" ]);
  }

}
