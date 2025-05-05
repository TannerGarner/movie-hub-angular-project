import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

describe('AuthService', () => {
  let service: AuthService;
  let afAuthStub: any;

  beforeEach(() => {
    afAuthStub = {
      signInWithEmailAndPassword: jasmine.createSpy('signInWithEmailAndPassword')
    };

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: AngularFireAuth, useValue: afAuthStub }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should call signInWithEmailAndPassword with correct email and password', async () => {
    const email = 'brunnera59@gmail.com';
    const password = 'password';

    const mockUserCredential: firebase.auth.UserCredential = {
      user: { uid: '123' } as firebase.User,
      credential: null,
      additionalUserInfo: null,
      operationType: 'signIn'
    }

    afAuthStub.signInWithEmailAndPassword.and.returnValue(Promise.resolve(mockUserCredential))

    const result = await service.login(email, password);

    expect(afAuthStub.signInWithEmailAndPassword).toHaveBeenCalledWith(email, password);
    expect(result).toEqual(mockUserCredential);
  })
});
