import { Component, OnInit } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
  constructor(
    private router: Router,
    private urlSerializer: UrlSerializer,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.handleAuthCallback();
  }

  async handleAuthCallback(): Promise<void> {
    try {
      await this.auth.handleRedirectCallback();
      const redirectURL = this.getRedirectURL();

      if (redirectURL) {
        this.router.navigateByUrl(redirectURL);
      } else {
        // Handle the default case if no redirect URL is specified
        // For example, redirect to the homepage or a default route
        this.router.navigate(['/']); // Replace '/' with your desired default route
      }
    } catch (error) {
      // Handle any errors that occur during the callback handling
      console.error('Error handling redirect callback:', error);
    }
  }

  login(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: `${window.location.origin}/layout`,
      },
    });
  }

  private getRedirectURL(): string {
    const urlTree = this.router.parseUrl(this.router.url);
    const queryParams = urlTree.queryParams;
    return queryParams['target'] || null;
  }
}
