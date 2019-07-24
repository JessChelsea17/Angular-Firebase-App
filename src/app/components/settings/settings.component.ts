import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  genders: string[] = ['Female', 'Male', 'Others'];
  user: any;
  saveProfile: FormGroup;
  editProfile: FormGroup;
  isEdit = false;
  hideEditSection: any = {};

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private firestoreService: FirestoreService,
    private formBuilder: FormBuilder) {
      this.saveProfile = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        age: ['', Validators.required],
        birthday: ['', Validators.required],
        gender: ['', Validators.required],
       });
       this.editProfile = this.formBuilder.group({
        id: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        age: ['', Validators.required],
        birthday: ['', Validators.required],
        gender: ['', Validators.required],
       })
     }

  ngOnInit() {
    // Firebase firestore
    this.getUserData();
    
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getUserData() {
    this.firestoreService.readUser().subscribe(data => {
      this.user = data.map(e => {
        if (e.payload.doc.data()['birthday'].hasOwnProperty('seconds')) {
          const date = e.payload.doc.data()['birthday'].toDate();
          return {
            id: e.payload.doc.id,
            isEdit: false,
            firstName: e.payload.doc.data()['firstName'],
            lastName: e.payload.doc.data()['lastName'],
            birthday: moment(date).format("DD/MM/YYYY"),
            gender: e.payload.doc.data()['gender'],
            age: e.payload.doc.data()['age'],
          };
        } else {
          return {
            id: e.payload.doc.id,
            isEdit: false,
            firstName: e.payload.doc.data()['firstName'],
            lastName: e.payload.doc.data()['lastName'],
            birthday: e.payload.doc.data()['birthday'],
            gender: e.payload.doc.data()['gender'],
            age: e.payload.doc.data()['age'],
          };
        }

      })
      console.log('users: ', this.user);
    });
  }

  updateUser(item, value) {
    this.isEdit = true;
    let user = {};
    user['firstName'] = item.firstName;
    user['lastName'] = item.lastName;
    user['birthday'] = item.birthday;
    user['gender'] = item.gender;
    user['age'] = item.age;
    this.firestoreService.updateUser(value.id, item);
    item.isEdit = false;
    console.log('update user: ', this.user);
  }

  editUser(user) {
    this.isEdit = true;
    Object.keys(this.hideEditSection).forEach(h => {
      this.hideEditSection[h] = false;
    });
    this.hideEditSection[user.id] = true;
  }

  cancelEdit() {
    this.isEdit = false;
  }

  createUser(createUser) {
    let user = {};
    user['firstName'] = createUser.firstName;
    user['lastName'] = createUser.lastName;
    user['birthday'] = createUser.birthday;
    user['gender'] = createUser.gender;
    user['age'] = createUser.age;
    this.firestoreService.createUser(user).then(resp => {
      console.log(resp);
    })
      .catch(error => {
        console.log(error);
      });
  }

  removeUser(userId) {
    this.firestoreService.deleteUser(userId);
  }
 
}
