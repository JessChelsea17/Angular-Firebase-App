export class userProfile {
    name:string;
    email:string;
}

export interface Task {
    id: string;
    name: string;
}

export interface Image {
    id: string;
    image: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    birthday: string
    age: string;
    gender: string;
}

export class Upload {

    $key: string;
    file:File;
    name:string;
    url:string;
    progress:number;
    createdAt: Date = new Date();
  
    constructor(file:File) {
      this.file = file;
    }
  }