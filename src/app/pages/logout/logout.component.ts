import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/features/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

  }

  ngOnInit() {
    console.log("LOGOUT");
    this.authService.logoutUser().pipe(
      finalize(() => {
        window.location.reload(); // TODO: (Logout) Nada de reload! Refazer
      })
    ).subscribe();
  }

}
