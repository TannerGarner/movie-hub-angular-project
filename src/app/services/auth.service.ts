import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private environmentInjector = inject(EnvironmentInjector);
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  register(username: string, password: string, email: string) {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        const uid = cred.user?.uid;
        if (uid) {
          return runInInjectionContext(this.environmentInjector, () => {
            return this.afs.collection('users').doc(uid).set({
              username: username,
              email: email,
              createdAt: new Date(),
              role: 'user'
            });
          })
          
        } else {
          return Promise.reject('No UID found')
        }
      });
  }

  logout() {
    return this.afAuth.signOut();
  }

  getIdToken(): Observable<string | null> {
    return from(
      this.afAuth.currentUser.then(user => {
        if (user) {
          return user.getIdToken(/* forceRefresh */ true);
        } else {
          return null;
        }
      })
    );
  }
}
