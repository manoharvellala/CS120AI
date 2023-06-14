import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

  constructor(
    private http: HttpClient,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    const body = { username: 'manohar' }; // Create the request body

    this.http
      .post<Category[]>('http://127.0.0.1:5000/getNavBarData', body)
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
      queryParams: { categoryName: categoryName },
    });
  }
  newChatButtonHandler() {
    this.location.replaceState('/');
    location.reload(); // Refresh the page
    const routePath = '/';
    this.router.navigate([routePath]);
  }
}
