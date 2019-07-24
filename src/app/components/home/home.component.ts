import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorageReference, AngularFireUploadTask, AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { FirestoreService } from 'src/app/services/firestore.service';
import { userProfile } from 'src/app/model/app.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<string>;
  uploadProgress: Observable<number>;
  downloadURL: Observable<string>
  images: any;
  image: string;
  userName: string;
  email: string;
  timestamp = new Date();
  isLike: boolean;
  buttonText: string = "LIKE";
  statusText: string;

  constructor(private afStorage: AngularFireStorage,
    private fireStoreService: FirestoreService) {
   }

  ngOnInit() {
    let users = this.getAll();
    users.forEach(user => {
      this.userName = user.name;
      this.email = user.email
    });
    this.getPost();
  }
  

  upload(event) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(id);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
    this.uploadProgress = this.task.percentageChanges();
   
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = this.ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
              this.image =  url;
              this.saveImage(this.image);
          }
        );
      })
    )
    .subscribe();
  }

  saveImage(file) {
    let imageName = {};
    imageName['image'] = file;
    imageName['time'] =  this.timestamp.getTime();
    imageName['status'] = 'LIKE';
    imageName['isLike'] = true;
    this.fireStoreService.uploadImage(imageName).then(resp => {
      console.log(resp);
    })
      .catch(error => {
        console.log(error);
      });
  }

  getPost() {
    this.fireStoreService.getUploadImage().subscribe(data => {
      this.images = data.map(e => {
        if (e.payload.doc.data()['image'] !== undefined) {
          return {
            id: e.payload.doc.id,
            image: e.payload.doc.data()['image'],
            time: e.payload.doc.data()['time'],
            isLike: e.payload.doc.data()['isLike'],
            status: e.payload.doc.data()['status']
          }
        }
      })
    });
  }

  getAll():userProfile[]{
    var data = localStorage.getItem('profile');
    if (data) {
        return <userProfile[]>(JSON.parse(data));
    } else {
       return [];
    }
  }

  removeImage(imageId) {
    this.fireStoreService.deleteImage(imageId);
  }

  likePhoto(item) {
    let photo = {};
    item.isLike = !item.isLike;
    item.status = item.isLike ? 'LIKE' : 'UNLIKE';
    this.buttonText = item.status;
    this.isLike = item.isLike;
    photo['status'] = item.status;
    photo['isLike'] = item.isLike;
    this.fireStoreService.updatePost(item.id, photo);
  }

  updatePost(item) {
    let image = {};
    image['image'] = item.image;
    image['time'] =  this.timestamp.getTime();
    image['status'] = item.status;
    image['isLike'] = item.isLike;
    this.fireStoreService.updatePost(item.id, item);
  }
}

