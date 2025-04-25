import { Component } from '@angular/core';


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

  login() {
    if (this.userLogin.username && this.userLogin.password) {
      console.log('Login clicked', this.userLogin);
    }  }
}
