import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<AuthResponse> {
    // Mock authentication - replace with actual API call
    const mockUser: User = {
      id: '1',
      email: loginRequest.email,
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token'
    };

    this.setCurrentUser(mockUser);
    this.saveUserToStorage(mockUser, response.token);
    
    return of(response);
  }

  register(registerRequest: RegisterRequest): Observable<AuthResponse> {
    // Mock registration - replace with actual API call
    const mockUser: User = {
      id: '2',
      email: registerRequest.email,
      firstName: registerRequest.firstName,
      lastName: registerRequest.lastName,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const response: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token'
    };

    this.setCurrentUser(mockUser);
    this.saveUserToStorage(mockUser, response.token);
    
    return of(response);
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private saveUserToStorage(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (userStr && token) {
      const user = JSON.parse(userStr);
      this.setCurrentUser(user);
    }
  }
}