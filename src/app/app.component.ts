import { afterNextRender, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from 'src/app/components/footer/footer.component';
import { AuthService } from './entities/auth/auth.service';

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
    afterNextRender(() => { // Necessary, as "localStorage" is only available in the browser, after SSR
      this.authService.autoLogin().subscribe();
    });
  }

}
