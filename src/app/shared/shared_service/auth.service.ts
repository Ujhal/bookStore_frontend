import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Decode JWT to get role (simple example using payload)
  // auth.service.ts
getUserRole(): number | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    const user = JSON.parse(userStr);
    return user.role ? Number(user.role) : null;
  } catch {
    return null;
  }
}





  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}