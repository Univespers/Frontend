import { afterNextRender, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService } from './features/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, FooterComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public title = 'Univespers';

  constructor(private authService: AuthService) {
    this.authService.autoLogin().subscribe();
  }

}
