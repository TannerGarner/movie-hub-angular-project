import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieDetailsPageComponent } from './components/movie-details-page/movie-details-page.component';
import { LoginComponent } from './components/login/login.component';
import { SearchPageComponent } from './components/search-page/search-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchPageComponent },
  { path: 'movie/:id', component: MovieDetailsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
