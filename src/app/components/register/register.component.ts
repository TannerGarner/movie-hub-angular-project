import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  userRegister = {
    username: '',
    password: '',
    email: ''
  }

  router: Router;
  authService: AuthService
  constructor(auth: AuthService, router: Router) {
    this.router = router
    this.authService = auth;
  }

  onSubmit(): void {
    if (this.userRegister.username && this.userRegister.password && this.userRegister.email) {
      this.authService.register(this.userRegister.username, this.userRegister.password, this.userRegister.email)
        .then(() => {
          alert('Registration Successful!');
          this.router.navigate(['login']);
        })
        .catch((error) => {
          switch (error.code) {
            case 'auth/email-already-in-use':
              alert('This email is already registered.');
              break;
            case 'auth/invalid-email':
              alert('Invalid email address.');
              break;
            case 'auth/weak-password':
              alert('Password is too weak. Please choose a stronger one.');
              break;
            default: // Handling angular/fire/compat incorrect error throwing, very messy and should fix later
              console.error('Unexpected error:', error);
              alert('An unexpected error occurred, Please try again.');

          }
        });
    } else {
      alert('Please fill out all fields.')
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
