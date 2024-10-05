import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserId: string | undefined;
  currentUserId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private afAuth: AngularFireAuth) {
    this.signInAnonymously();
  }

  private async signInAnonymously() {
    try {
      const userCredential = await this.afAuth.signInAnonymously();
      if (userCredential.user) {
        const uid = userCredential.user.uid;
        this.currentUserId$.next(uid);
        console.log('Anonymous sign-in successful:', uid);
      } else {
        console.error('Anonymous sign-in failed: user is null');
      }
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
    }
  }

  // ... any additional authentication methods ...
}
