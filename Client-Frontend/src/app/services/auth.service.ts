import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:3100/api/auth';
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';
  private usernameKey = 'username';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getAuthToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.tokenKey) : null;
  }

  private checkLoginStatus(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem(this.tokenKey);
  }

  loginService(loginData: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, loginData);
  }

  registerService(registerData: { email: string; userName: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, registerData);
  }

  setLoginStatus(response: { data: { _id: string; username: string }; token: string }): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, response.token);
      localStorage.setItem(this.userIdKey, response.data._id);
      localStorage.setItem(this.usernameKey, response.data.username);
      this.isLoggedInSubject.next(true);
    }
  }

  getUserId(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.userIdKey) : null;
  }

  getUsername(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.usernameKey) : null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/request-password-reset`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, newPassword });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userIdKey);
      localStorage.removeItem(this.usernameKey);
      this.isLoggedInSubject.next(false);
    }
  }
}
