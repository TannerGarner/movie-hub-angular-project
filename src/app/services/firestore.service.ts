import { ChangeDetectorRef, EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatestWith, filter, forkJoin, map, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { RawComment, SanitizedComment } from '../interfaces/comment.interface';
import { RawUser, SanitizedUser } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {
  private environmentInjector = inject(EnvironmentInjector);
  userId = localStorage.getItem('userId');
  constructor(private afs: AngularFirestore) {}

  getUsers(userIDs?: string[]): Observable<SanitizedUser[]> {
    return runInInjectionContext(this.environmentInjector, () => {
      if (!userIDs || userIDs.length === 0) {
        return of([]);
      }
  
      // Create an array of observables, one for each user document:
      const userObservables = userIDs.map(userID =>
        this.afs.doc<RawUser>(`users/${userID}`)
          .valueChanges()
          .pipe(
            filter((userData: RawUser | undefined): userData is RawUser => !!userData),
            map((userData: RawUser): SanitizedUser => ({
              ...userData,
              userID: userID, // Add userID to each user object
            })),
            take(1)
          )
      );
  
      // Combine all observables into a single observable that emits an array of users:
      return forkJoin(userObservables);
    });
  }

  // addUser(user: any): Promise<any> {
  //   const usersRef = collection(this.firestore, 'users');
  //   return addDoc(usersRef, user);
  // }

  // getWatchlist(userId: string):Observable<any[]> {
  //   const watchlistRef = collection(this.firestore, `users/${userId}/watchlist`);
  //   console.log(watchlistRef)
  //   return (watchlistRef)
  // } 

  getAllComments(movieID: number): Observable<SanitizedComment[]> {
    return runInInjectionContext(this.environmentInjector, () => {
      if (!this.userId) {
        throw new Error('User ID not found in localStorage');
      }
      return this.afs
        .collection<RawComment>('comments', ref => ref.where('movieID', '==', movieID.toString()))
        .valueChanges()
        .pipe(
          switchMap((comments: RawComment[]) => {
            const userIDs = comments.map(comment => comment.userID);

            const users$: Observable<SanitizedUser[]> = this.getUsers(userIDs);

            const comments$: Observable<SanitizedComment[]> = users$.pipe(
              map((users) => {
                const userMap = new Map(users.map(user => [user.userID, user]));

                const sanitizedComments = comments.map(comment => ({
                  ...comment,
                  username: userMap.get(comment.userID)?.username || 'Unknown User',
                  date: comment.date.toDate() // Convert firestore Timestamp to JS Date
                }));

                return sanitizedComments.sort((a, b) => b.date.getTime() - a.date.getTime());
              })
            );

            return comments$;
          })
        );
    });
  }

  addComment(movieId: number, comment: string): Promise<any> {
    return runInInjectionContext(this.environmentInjector, () => {
      if (!this.userId) {
        throw new Error('User ID not found in localStorage');
      }
      const commentData = {
        movieID: movieId.toString(),
        userID: this.userId,
        text: comment,
        date: new Date()
      };
      return this.afs.collection('comments').add(commentData);
    })
  }

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
