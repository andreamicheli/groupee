import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp} from '@angular/fire/app'
import { getFirestore, provideFirestore} from '@angular/fire/firestore'
import { routes } from './app.routes';
import { provideAuth, getAuth } from '@angular/fire/auth';


import { FIREBASE_OPTIONS } from '@angular/fire/compat';


const firebaseConfig = {
  apiKey: "AIzaSyB7T5Y94i-4OKADzgOJvTKkhz9OlRZzrxw",
  authDomain: "groupee-fi.firebaseapp.com",
  projectId: "groupee-fi",
  storageBucket: "groupee-fi.appspot.com",
  messagingSenderId: "727053500379",
  appId: "1:727053500379:web:4da320676725896f6b31fe",
  measurementId: "G-65WQ3CX0ND"
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};

