import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  categories: Category[] = [];
  loggedInUser: any;
  loginButtonDisplay: boolean = true;

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.getUserInfo();
  }

  fetchCategories(userName: any) {
    const body = { username: userName }; // Create the request body
    console.log(body);
    this.http
      .post<Category[]>(
        'https://manoharvellala.pythonanywhere.com/getNavBarData',
        body
      )
      .subscribe(
        (response) => {
          this.categories = response;
          console.log(this.categories);
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
  }

  navigateToCategory(categoryName: string) {
    // Replace with the desired route path for the category details
    const routePath = `/previous-chats/${categoryName}`;

    this.router.navigate([routePath], {
      queryParams: {
        categoryName: categoryName,
        username: this.loggedInUser.name,
      },
    });
  }
  newChatButtonHandler() {
    this.location.replaceState('/');
    location.reload(); // Refresh the page
    const routePath = '/';
    this.router.navigate([routePath]);
    this.login();
  }
  getUserInfo() {
    this.auth.user$.subscribe((user) => {
      this.loggedInUser = user;
      console.log(this.loggedInUser);
      if (this.loggedInUser != null) {
        this.loginButtonDisplay = false;
        this.fetchCategories(this.loggedInUser.name);
      }
    });
  }
  login() {
    // Add your login logic here
    // For example, you can call auth.loginWithRedirect() to initiate the authentication process
    this.auth.loginWithRedirect();
  }
  logout() {
    // Add your logout logic here
    // Example: Call the logout method from AuthService if available
    this.auth.logout();
    this.loginButtonDisplay = true;
  }
}
