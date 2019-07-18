import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

const STORAGE_KEY = 'profile';

@Injectable()
export class LocalstorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public storeOnLocalStorage(name: string, email:string): void {
          
    // get array of user profile from local storage
    const userProfile = this.storage.get(STORAGE_KEY) || [];
    // push new user profile to array
    userProfile.push({
      name: name,
      email: email
  });
    // insert updated array to local storage
    this.storage.set(STORAGE_KEY, userProfile);
    console.log(this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
 }
}