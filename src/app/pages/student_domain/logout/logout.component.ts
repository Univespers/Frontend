import { afterNextRender, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/entities/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor(private authService: AuthService) {
  }
  
  ngOnInit() {
    console.log("LOGOUT");
    this.authService.logout();
  }

}
