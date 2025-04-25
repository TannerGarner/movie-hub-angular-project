import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirestoreService {

  constructor(private firestore: Firestore) { }

  getUsers(): Observable<any[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef) as Observable<any[]>;
  }

  addUser(user: any): Promise<any> {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, user);
  }
}
