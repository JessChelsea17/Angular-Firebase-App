// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: { 
    apiKey: "AIzaSyCiW4M4ygO9hw6TGLTsdGn9fE8pnVU8Qao",
    authDomain: "app-sample-firebase.firebaseapp.com",
    databaseURL: "https://app-sample-firebase.firebaseio.com",
    projectId: "app-sample-firebase",
    storageBucket: "gs://app-sample-firebase.appspot.com/",
    messagingSenderId: "212075008887",
    appId: "1:212075008887:web:58fceacae39e8a74"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
