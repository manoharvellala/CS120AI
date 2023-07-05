import { Component, OnInit } from '@angular/core';
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
    // Simulating authentication
    this.auth.loginWithRedirect({
      appState: {
        target: encodeURI(
          'https://main--stellar-melomakarona-c6a325.netlify.app/layout'
        ),
      },
    });
  }
}
