import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviousChatsComponent } from './components/previous-chats/previous-chats.component';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';

const routes: Routes = [
  { path: '', redirectTo: 'authentication', pathMatch: 'full' }, // Redirect to '/authentication' as the default route
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'layout', component: LayoutComponent },
  { path: 'previous-chats/:category.name', component: PreviousChatsComponent },
  {
    path: 'https://stellar-melomakarona-c6a325.netlify.app/layout',
    component: LayoutComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
