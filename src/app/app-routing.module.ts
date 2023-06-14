import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviousChatsComponent } from './components/previous-chats/previous-chats.component';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';


const routes: Routes = [
  
    {path: '',component: LayoutComponent},
    {path: 'previous-chats/:category.name', component: PreviousChatsComponent }
    
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

