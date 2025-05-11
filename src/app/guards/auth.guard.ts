import { CanActivateFn, Router } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Observable<boolean>((observer) => {
    authService.afAuth.authState.subscribe((user) => {
      if (user) {
        observer.next(true);
      } else {
        router.navigate(['/login']);
        observer.next(false);
      }
      observer.complete();
    });
  });
};
