import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

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

  constructor(private auth: AuthService) {
    this.authService = auth;
  }

  ngOnInit() {
    
  }

  login() {
    if (this.userLogin.username && this.userLogin.password) {
      this.authService.login(this.userLogin.username, this.userLogin.password)
        .then(() => {
          alert('Login successful!');
        })
        .catch((error) => {
          alert(`Login Failed: ${error}`);
        });
    }  
  }
}
