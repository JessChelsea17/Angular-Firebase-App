import { TestBed, inject } from '@angular/core/testing';

import { AngularFireAuth } from 'angularfire2/auth';
import { of } from 'rxjs';
import { AuthService } from './auth.service';
import { MockUser } from '../unit-test/mockUser.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';

const authState = {
  email: 'lanchanagupta@gmail.com',
  password: 'password',
  uid: 'nuDdbfbhTwgkF5C6HN5DWDflpA83'
};

const mockAngularFireAuth = {
  auth: jasmine.createSpyObj('auth', {
    'signInWithPopup': Promise.resolve({
      user: authState
    }),
  })
};

fdescribe('AuthService', () => {
  let authService;
  beforeEach(() => {
   TestBed.configureTestingModule({
      imports: [
      AngularFireDatabaseModule,
      AngularFireModule.initializeApp(environment.firebase),
      RouterTestingModule
      ],
     providers: [
       {provide: AngularFireAuth, useValue: mockAngularFireAuth},
       AuthService,
     ]
  });

   inject([AuthService], (service: AuthService) => {
   authService = service;
   })();
 });

   it('should return a rejected promise', () => {
    const authState = {
      email: 'lanchanagupta@gmail.com',
      password: 'password',
    };
    
    const mockAngularFireAuth = {
      auth: jasmine.createSpyObj('auth', {
        'signInWithPopup': Promise.reject({
          code: 'auth/account-exists-with-different-credential'
        }),
      }),
      authState: of(authState)
    };
    mockAngularFireAuth.auth.signInWithPopup()
      .catch((error: { code: string }) => {
        console.log('error.code', error.code);
        expect(error.code).toBe('auth/account-exists-with-different-credential');
      });
    });
    
    
    it('should return a resolved promise', () => {
      const authState = {
      email: 'lanchanagupta@gmail.com',
      password: 'password',
      uid: 'nuDdbfbhTwgkF5C6HN5DWDflpA83'
    };
    
    const mockAngularFireAuth = {
      auth: jasmine.createSpyObj('auth', {
        'signInWithPopup': Promise.resolve({
          user: authState
        }),
      })
    };
    mockAngularFireAuth.auth.signInWithPopup()
      .then(data => {
        expect(data['user']).toBe(authState);
      });
    });
});
