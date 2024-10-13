import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // Upload JSON data to Firestore
  uploadJSONData(jsonData: any, collectionName: string) {
    const collectionRef = this.firestore.collection(collectionName);
    
    // Loop through the JSON keys and add each document to Firestore
    Object.keys(jsonData).forEach((key) => {
      const docData = jsonData[key];
      collectionRef.doc(key).set(docData)
        .then(() => {
          console.log(`Document ${key} successfully written!`);
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
    });
  }
}
