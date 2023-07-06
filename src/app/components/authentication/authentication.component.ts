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
    this.auth.loginWithRedirect().subscribe(
      () => {
        // After successful login, handle the redirect callback
        this.auth.handleRedirectCallback().subscribe(
          () => {
            // Redirect to the target URL
            const targetUrl = window.location.origin + '/layout';
            if (targetUrl) {
              window.location.href = targetUrl;
            } else {
              // If no target URL is specified, redirect to a default page
              window.location.href = '/default-page';
            }
          },
          (error) => {
            // Handle error while processing redirect callback
            console.error('Error handling redirect callback:', error);
          }
        );
      },
      (error) => {
        // Handle error during login
        console.error('Error during login:', error);
      }
    );
  }
}
