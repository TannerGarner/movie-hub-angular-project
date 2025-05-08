import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userLogin = {
    email: '',
    password: ''
  }

  token: string | null = null;
  authService: AuthService;
  router: Router;
  constructor(router: Router, auth: AuthService) {
    this.router = router;
    this.authService = auth;
  }

  ngOnInit() {
    
  }

  login() {
    if (this.userLogin.email && this.userLogin.password) {
      this.authService.login(this.userLogin.email, this.userLogin.password)
        .then(() => {
          alert('Login successful!');
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          alert(`Login Failed: ${error}`);
        });
    }  
    this.authService.getIdToken().subscribe(token => {
      this.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    })
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
