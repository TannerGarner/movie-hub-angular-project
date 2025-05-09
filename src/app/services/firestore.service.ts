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

  addToHasWatched(movieId: number) {
    if(!this.userId) {
      throw new Error('User ID not found in localStorage');
    }
    return runInInjectionContext(this.environmentInjector, () => {
      const collectionRef = this.afs.collection(`users/${this.userId}/watchData`, ref => 
        ref.where('movieID', '==', movieId)
      )
  
      return collectionRef.get().toPromise().then(snapshot => {
        if (snapshot && !snapshot.empty) {
          const doc = snapshot.docs[0];
          console.log('Item already exists, updating...');
          
          return runInInjectionContext(this.environmentInjector, () => {
            return this.afs.doc(`users/${this.userId}/watchData/${doc.id}`)
            .update({hasWatched: true})
            .then(() => {});
          })
        } else {
          return runInInjectionContext(this.environmentInjector, () => {
            console.log('Movie added to collection')
            return this.afs.collection(`users/${this.userId}/watchData`)
              .add({movieID: movieId, hasWatched: true})
              .then(() => {});
          })
        }
      })
    })
  }

  removeFromHasWatched(movieId: number) {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage');
    }
    return runInInjectionContext(this.environmentInjector, () => {
      const collectionRef = this.afs.collection(`users/${this.userId}/watchData`, ref =>
        ref.where('movieID', '==', movieId)
      )

      return collectionRef.get().toPromise().then(snapshot => {
        if (snapshot && !snapshot.empty) {
          const doc = snapshot.docs[0];
          console.log('Item found, updating...');

          return runInInjectionContext(this.environmentInjector, () => {
            return this.afs.doc(`users/${this.userId}/watchData/${doc.id}`)
              .update({hasWatched: false})
              .then(() => {});
          })
        } else {
          return null;
        }
      })
    })
  }

  addToWatchlist(movieId: number) {
    if(!this.userId) {
      throw new Error('User ID not found in localStorage');
    }
    return runInInjectionContext(this.environmentInjector, () => {
      const collectionRef = this.afs.collection(`users/${this.userId}/watchData`, ref => 
        ref.where('movieID', '==', movieId)
      )
  
      return collectionRef.get().toPromise().then(snapshot => {
        if (snapshot && !snapshot.empty) {
          const doc = snapshot.docs[0];
          console.log('Item already exists, updating...');
          
          return runInInjectionContext(this.environmentInjector, () => {
            return this.afs.doc(`users/${this.userId}/watchData/${doc.id}`)
            .update({onWatchList: true})
            .then(() => {});
          })
        } else {
          return runInInjectionContext(this.environmentInjector, () => {
            console.log('Movie added to collection')
            return this.afs.collection(`users/${this.userId}/watchData`)
              .add({movieID: movieId, onWatchList: true})
              .then(() => {});
          })
        }
      })
    })
  }

  removeFromWatchlist(movieId: number) {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage');
    }
    return runInInjectionContext(this.environmentInjector, () => {
      const collectionRef = this.afs.collection(`users/${this.userId}/watchData`, ref =>
        ref.where('movieID', '==', movieId)
      )

      return collectionRef.get().toPromise().then(snapshot => {
        if (snapshot && !snapshot.empty) {
          const doc = snapshot.docs[0];
          console.log('Item found, updating...');

          return runInInjectionContext(this.environmentInjector, () => {
            return this.afs.doc(`users/${this.userId}/watchData/${doc.id}`)
              .update({onWatchList: false})
              .then(() => {});
          })
        } else {
          return null;
        }
      })
    })
  }

  rateMovie(movieId: number, rating: number) {
    if (!this.userId) {
      throw new Error('User ID not found in localStorage');
    }
    return runInInjectionContext(this.environmentInjector, () => {
      const collectionRef = this.afs.collection(`users/${this.userId}/watchData`, ref =>
        ref.where('movieID', '==', movieId)
      )

      return collectionRef.get().toPromise().then(snapshot => {
        if(snapshot && !snapshot.empty) {
          const doc = snapshot.docs[0];
          console.log('Item already exists, updating...');

          return runInInjectionContext(this.environmentInjector, () => {
            return this.afs.doc(`users/${this.userId}/watchData/${doc.id}`)
              .update({rating: rating})
              .then(() => {});
          })
        } else {
          return null;
        }
      })
    })
  }
}
