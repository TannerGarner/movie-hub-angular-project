import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  authService: AuthService;
  router: Router;

  constructor(router: Router, authService: AuthService) {
    this.router = router;
    this.authService = authService;
  }

  logout() {
    this.authService.logout().then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      this.router.navigate(['/login'])
    })
  }

  goTo(path: string) {
    this.router.navigate(['/' + path])
  }
}
