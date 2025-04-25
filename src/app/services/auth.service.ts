import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {}

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  register(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then(cred => {
        const uid = cred.user?.uid;
        if (uid) {
          return this.afs.collection('users').doc(uid).set({
            email: email,
            createdAt: new Date(),
            role: 'user'  // or whatever default data you want
          });
        } else {
          return Promise.reject('No UID found')
        }
      });
  }

  logout() {
    return this.afAuth.signOut();
  }
}
