// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyB7T5Y94i-4OKADzgOJvTKkhz9OlRZzrxw',
  authDomain: 'groupee-fi.firebaseapp.com',
  projectId: 'groupee-fi',
  storageBucket: 'groupee-fi.appspot.com',
  messagingSenderId: '727053500379',
  appId: '1:727053500379:web:4da320676725896f6b31fe',
  measurementId: 'G-65WQ3CX0ND',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
