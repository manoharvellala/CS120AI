import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Add this import

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PreviousChatsComponent } from './components/previous-chats/previous-chats.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthModule } from '@auth0/auth0-angular';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PreviousChatsComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatMenuModule,
    MatIconModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: 'dev-qik1l2ef.us.auth0.com',
      clientId: 'oUrswndoUdvwXcN95NeS8wx9c19GAZm9',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
