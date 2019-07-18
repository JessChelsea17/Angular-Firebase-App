import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { userProfile } from 'src/app/model/app.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  name: string;
  email: string

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private localStorageService: LocalstorageService, 
    private authService: AuthService, 
    private firestoreService: FirestoreService) {
    
     }

  ngOnInit() {
    // Firebase authentication
    this.authService.userInfos.pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe((res: userProfile) => {
      if(res !== null) {
        this.localStorageService.storeOnLocalStorage(res.name, res.email);
      }
    });
    let users = this.getAll();
    users.forEach(user => {
      this.name = user.name;
      this.email = user.email;
    });

  
    
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getAll():userProfile[]{
    var data = localStorage.getItem('profile');
    if (data) {
        return <userProfile[]>(JSON.parse(data));
    } else {
       return [];
    }
  }
 }

