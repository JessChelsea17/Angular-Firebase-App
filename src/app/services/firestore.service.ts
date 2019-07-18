import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { userConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

   
  createUser(user: object) {
    return this.firestore.collection(`${userConfig.collection_endpoint}`).add(user);
  }
 
  readUser() {
    return this.firestore.collection(`${userConfig.collection_endpoint}`).snapshotChanges();
  }
 
  updateUser(userId: string, user: object){
    this.firestore.doc(`${userConfig.collection_endpoint}/` + userId).update(user);
  }
 
  deleteUser(userId: string) {
    this.firestore.doc(`${userConfig.collection_endpoint}/` + userId).delete();
  }
}
