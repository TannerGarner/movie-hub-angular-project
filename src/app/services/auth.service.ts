import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private environmentInjector = inject(EnvironmentInjector);
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  googleLogin(): Promise<any> {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithPopup(provider)
    .then(cred => {
      const uid = cred.user?.uid;
      if (!uid) throw new Error('User UID not found');

      localStorage.setItem('userId', uid);

      return runInInjectionContext(this.environmentInjector, async () => {
        const userDocRef = this.afs.collection('users').doc(uid);
        const docSnapshot = await userDocRef.get().toPromise();

        if (!docSnapshot?.exists) {
          const userData = {
            username: cred.user?.displayName || '',
            email: cred.user?.email || '',
            photoURL: cred.user?.photoURL || '',
            createdAt: new Date(),
            role: 'user'
          };
          await userDocRef.set(userData);
          return userData;
        } else {
          return docSnapshot.data();
        }
      })
    })
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then(cred => {
        const uid = cred.user?.uid;
        if(!uid) throw new Error('User UID not found')

        localStorage.setItem('userId', uid)

        return runInInjectionContext(this.environmentInjector, () => {
          return this.afs.collection('users').doc(uid).get().toPromise()
          .then(doc => {
            if (doc?.exists) {
              // const userData = doc.data();
              // localStorage.setItem('user', JSON.stringify(userData));
              // return userData;
              return doc.data();
            } else {
              throw new Error('User data not found in firestore')
            }
          })
        })
      })
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
