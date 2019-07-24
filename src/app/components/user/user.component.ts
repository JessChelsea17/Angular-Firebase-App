import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { userProfile } from 'src/app/model/app.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput', null) el: ElementRef;
  name: string;
  email: string;
  imageForm: FormGroup;
  imageUrl: any = 'https://data.whicdn.com/images/275162999/original.gif';

  private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private localStorageService: LocalstorageService, 
    private authService: AuthService,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private firestoreService: FirestoreService,) {
      this.imageForm = this.fb.group({
        file: [null]
      })  
    }

  ngOnInit() {
    // Firebase authentication
    this.authService.userInfos.pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe((res: userProfile) => {
      console.log('response: ', res);
      if(res !== null) {
        this.localStorageService.storeOnLocalStorage(res.name, res.email);
      }
    });
    let users = this.getAll();
    users.forEach(user => {
      this.name = user.name;
      this.email = user.email;
    });
    this.getAdminDetails();
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

  uploadFile(event) {
    console.log('event: ', event);
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.imageForm.patchValue({
          file: reader.result
        });
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
      console.log('photoName: ', this.imageForm.value);
    }
  }

  // // Function to remove uploaded file
  // removeUploadedFile() {
  //   // let newFileList = Array.from(this.el.nativeElement.files);
  //   this.imageUrl = 'https://i.pinimg.com/236x/d6/27/d9/d627d9cda385317de4812a4f7bd922e9--man--iron-man.jpg';
  //   this.editFile = true;
  //   this.removeUpload = false;
  //   this.imageForm.patchValue({
  //     file: [null]
  //   });
  // }
  
  // Submit Registration Form
  onSubmit() {
  }

  getAdminDetails() {
    this.firestoreService.readAdmin().subscribe(data => {
    data.map(e => {
      console.log('data: ', e.payload.doc.data()['picture']);
          return {
            id: e.payload.doc.id,
            photo: e.payload.doc.data()['picture']
          };
        })
     });
   }
}
