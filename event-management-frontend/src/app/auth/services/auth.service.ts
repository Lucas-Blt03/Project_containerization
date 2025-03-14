import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromToken());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  register(username: string, email: string, password: string, role: string = 'user'): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/register`, {
      username,
      email,
      password,
      role
    });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.tokenService.saveToken(response.token);
        this.currentUserSubject.next(this.getUserFromToken());
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.tokenService.getToken() && !this.tokenService.isTokenExpired();
  }

  getUserRole(): string | null {
    const user = this.currentUserValue;
    return user ? user.role : null;
  }

  checkRole(allowedRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? allowedRoles.includes(userRole) : false;
  }

  private getUserFromToken(): User | null {
    const token = this.tokenService.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        username: payload.username || payload.email.split('@')[0], // Fallback if username not in token
        role: payload.role
      };
    } catch (error) {
      return null;
    }
  }
}