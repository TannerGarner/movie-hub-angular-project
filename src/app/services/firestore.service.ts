import { ChangeDetectorRef, EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  private environmentInjector = inject(EnvironmentInjector);
  userId = localStorage.getItem('userId');

  constructor(private afs: AngularFirestore) {}

  // getUsers(): Observable<any[]> {
  //   const usersRef = collection(this.firestore, 'users');
  //   return collectionData(usersRef) as Observable<any[]>;
  // }

  // addUser(user: any): Promise<any> {
  //   const usersRef = collection(this.firestore, 'users');
  //   return addDoc(usersRef, user);
  // }

  // getWatchlist(userId: string):Observable<any[]> {
  //   const watchlistRef = collection(this.firestore, `users/${userId}/watchlist`);
  //   console.log(watchlistRef)
  //   return (watchlistRef)
  // } 

  getWatchData(): Observable<any[]> {
    return runInInjectionContext(this.environmentInjector, () => {
      if (!this.userId) {
        throw new Error('User ID not found in localStorage');
      }
      return this.afs
      .collection('users')
      .doc(this.userId)
      .collection('watchData')
      .valueChanges();
    })
  }

}
