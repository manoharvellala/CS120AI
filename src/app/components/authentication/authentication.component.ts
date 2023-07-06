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
    private urlSerializer: UrlSerializer,
    public auth: AuthService
  ) {}

  login(): void {
    const targetUrl = this.urlSerializer.serialize(
      this.router.createUrlTree(['/layout'])
    );
    const cleanedTargetUrl = targetUrl.split('?')[0]; // Remove query parameters

    this.auth.loginWithRedirect({
      appState: {
        target: cleanedTargetUrl,
      },
    });
  }
}
