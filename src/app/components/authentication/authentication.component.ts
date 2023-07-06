import { Component, OnInit } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent {
  constructor(
    private router: Router,

    public auth: AuthService
  ) {}

  login(): void {
    console.log(window.location.origin);
    this.auth.loginWithRedirect({
      appState: {
        target: `${window.location.origin}` + '/layout',
        state: '1234',
      },
    });
  }
}
