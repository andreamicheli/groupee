// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.isHost().pipe(
      take(1),
      map(isHost => {
        if (isHost) {
          return true;
        } else {
          return this.router.parseUrl('host/login');
        }
      }),
      tap(canActivate => {
        if (typeof canActivate === 'object') {
          console.log('Access denied - Redirecting to login');
        }
      })
    );
  }
}
