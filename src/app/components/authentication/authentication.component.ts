import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent {
  constructor(private router: Router, public auth: AuthService) {}

  login(): void {
    const redirectUri = `${window.location.origin}/layout`;
    this.auth.loginWithRedirect({
      appState: { state: redirectUri },
    });
  }
}
