import { Injectable } from '@angular/core';
import {
  AngularFirestore,
} from '@angular/fire/firestore';
import { userConfig, adminConfig, postConfig } from '../config/app.config';

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

  readAdmin() {
    return this.firestore.collection(`${adminConfig.collection_endpoint}`).snapshotChanges();
  }

  uploadFile(file: any) {
    return this.firestore.collection(`${adminConfig.collection_endpoint}`).add(file);
  }

  uploadImage(file: any) {
    return this.firestore.collection(`${postConfig.collection_endpoint}`).add(file);
  }

  getUploadImage() {
    return this.firestore.collection(`${postConfig.collection_endpoint}`).snapshotChanges();
  }

  deleteImage(imageId: string) {
    this.firestore.doc(`${postConfig.collection_endpoint}/` + imageId).delete();
  }

  updatePost(imageId: string, image: object){
    this.firestore.doc(`${postConfig.collection_endpoint}/` + imageId).update(image);
  }
}
