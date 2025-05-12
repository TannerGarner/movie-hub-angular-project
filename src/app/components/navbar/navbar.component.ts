import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  authService: AuthService;
  router: Router;
  isMobileMenuOpen: boolean = false;
  isSmallScreen: boolean = false;

  constructor(router: Router, authService: AuthService, private breakpointObserver: BreakpointObserver) {
    this.router = router;
    this.authService = authService;
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
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

  toggleMobileMenu(path?: string){
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (path) {
      this.router.navigate(['/' + path]);
    }
  }
}
