import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/features/auth/auth.service';
import { CurrentStatus } from 'src/app/current-status';

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
  ) {}

  ngOnInit() {
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGOUT_PAGE] Call Logout");
    this.authService.logout().subscribe({
      next: () => {
        this.redirectToLogin();
      }
    });
  }

  // Redirects
  redirectToLogin() {
    if(CurrentStatus.DEBUG_MODE) console.log("[LOGOUT_PAGE] Redirect to Login");
    this.router.navigate([ "/login" ]);
  }

}
