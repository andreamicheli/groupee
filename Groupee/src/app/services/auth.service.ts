// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUserId$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  isHost$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.currentUserId$.next(user.uid);
        console.log('User authenticated with UID:', user.uid);
        // Determine if the user is a host based on the authentication provider
        this.isHost$.next(this.isUserHost(user));
      }
      
    });
  }

  /**
   * Determines if the authenticated user is a host based on their authentication provider.
   * @param user Firebase user object
   * @returns boolean indicating if the user is a host
   */
  private isUserHost(user: firebase.User): boolean {
    // Hosts are authenticated via Google; participants are anonymous
    return user.providerData.some(
      (provider) => provider?.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID
    );
  }

  /**
   * Signs in the user anonymously (for participants).
   */
  async signInAnonymously() {
    try {
      const userCredential = await this.afAuth.signInAnonymously();
      if (userCredential.user) {
        const uid = userCredential.user.uid;
        this.currentUserId$.next(uid);
        this.isHost$.next(false);
        console.log('Anonymous sign-in successful:', uid);
      } else {
        console.error('Anonymous sign-in failed: user is null');
      }
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
    }
  }

  /**
   * Signs in the user via Google (for hosts).
   */
  async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const credential = await this.afAuth.signInWithPopup(provider);
      if (credential.user) {
        this.currentUserId$.next(credential.user.uid);
        this.isHost$.next(true);
        console.log('Google Sign-In successful:', credential.user.uid);
        // Redirect to Settings page after successful login
        this.router.navigate(['/host/settings']);
      }
      return credential;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return null;
    }
  }

  /**
   * Signs out the user.
   */
  async signOut() {
    try {
      await this.afAuth.signOut();
      console.log('User signed out');
      // After sign out, redirect to login if necessary
      this.router.navigate(['/host/login']);
    } catch (error) {
      console.error('Sign-Out Error:', error);
    }
  }

  /**
   * Observable to check if the user is authenticated.
   */
  isAuthenticated(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      // Map to a boolean indicating if the user is authenticated
      map(user => !!user)
    );
  }

  /**
   * Observable to check if the user is a host.
   */
  isHost(): Observable<boolean> {
    return this.isHost$.asObservable();
  }
}
