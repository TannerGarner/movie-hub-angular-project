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
    username: '',
    password: ''
  }
  authService: AuthService;
  router: Router;
  constructor(router: Router, auth: AuthService) {
    this.router = router;
    this.authService = auth;
  }

  ngOnInit() {
    
  }

  login() {
    if (this.userLogin.username && this.userLogin.password) {
      this.authService.login(this.userLogin.username, this.userLogin.password)
        .then(() => {
          alert('Login successful!');
          this.router.navigate(['/home']);
        })
        .catch((error) => {
          alert(`Login Failed: ${error}`);
        });
    }  
  }
}
