import { Injectable } from  '@angular/core';
import { Router } from  "@angular/router";
import { AngularFireAuth } from  "@angular/fire/auth";
import { User } from  'firebase';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { userProfile } from '../model/app.model';

@Injectable({
    providedIn:  'root'
})
export  class  AuthService {

    private userInfo = new BehaviorSubject(null);
    user: User;
    profile: userProfile;

    constructor(public  afAuth:  AngularFireAuth, public  router:  Router) { 
    }

    doLogin(value){
      this.profile = {
        name: 'User',
        email: value.email
      }
        return new Promise<any>((resolve, reject) => {
          firebase.auth().signInWithEmailAndPassword(value.email, value.password)
          .then(res => {
            console.log("res: ", res);
            this.userInfo.next(this.profile);
            console.log('Sign-in success: ' + value.email);
            resolve(res);
          }, err => {
            reject(err);
          })
        })
      }

    doLogout(){
        return new Promise((resolve, reject) => {
          if(firebase.auth().currentUser){
            this.afAuth.auth.signOut();
            resolve();
          }
          else{
            reject();
          }
        });
    }

    doRegister(value){
      this.profile = {
        name: value.fullname,
        email: value.email
      }
      return new Promise<any>((resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(res => {
          resolve(res);
          console.log('Register success: ' + value.email);
        }, err => reject(err))
      })
    }

    doGoogleLogin(){
      return new Promise<any>((resolve, reject) => {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          this.userInfo.next({...res.additionalUserInfo.profile});
          resolve(res);
        })
      })
    }

    doFacebookLogin(){
      return new Promise<any>((resolve, reject) => {
        let provider = new firebase.auth.FacebookAuthProvider();
        this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          this.userInfo.next({...res.additionalUserInfo.profile});
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
      })
   }

   get userInfos() {
    return this.userInfo.asObservable();
  }
}
