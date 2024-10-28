// src/app/pages/host/login/login.component.ts
import { Component, HostBinding } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-host-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HostLoginComponent {
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private auth: AuthService) {}
  @HostBinding('class') className = 'w-full';


  async loginWithGoogle() {
    this.isLoading = true;
    this.errorMessage = null;
    try {
      const result = await this.auth.signInWithGoogle();
      if (!result) {
        this.errorMessage = 'Google Sign-In failed. Please try again.';
      }
      // Navigation is handled within AuthService
    } catch (error) {
      this.errorMessage = 'An unexpected error occurred during sign-in.';
    } finally {
      this.isLoading = false;
    }
  }
}
