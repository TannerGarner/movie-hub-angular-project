import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'movie-hub-angular-project';
  isloggedIn: boolean = false;
  constructor(private router: Router) { 
    this.router.events.subscribe(() => {
      this.isloggedIn = this.router.url !== '/login' && this.router.url !== '/register';
    });
  }
}
