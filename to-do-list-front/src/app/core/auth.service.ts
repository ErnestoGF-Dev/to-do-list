import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { User } from '../types/user-type';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
user() {
throw new Error('Method not implemented.');
}
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private readonly credentials = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user_todo');
      
      if (savedUser) {
        this.credentials.set(savedUser);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  login(user: User) {
    if (isPlatformBrowser(this.platformId)) {
      const userData = JSON.stringify(user);
      localStorage.setItem('user_todo', userData);
      this.credentials.set(userData);
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_todo');
      this.credentials.set(null);
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated() {
    return this.credentials() !== null;
  }

  getUserData(): User | null {
    const data = this.credentials();
    return data ? JSON.parse(data) : null;
  }
}