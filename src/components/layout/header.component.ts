import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar class="header-toolbar">
      <div class="toolbar-content">
        <div class="logo-section">
          <mat-icon class="logo-icon">settings</mat-icon>
          <span class="logo-text">Grain Grinder Parts</span>
        </div>
        
        <div class="nav-section">
          <button mat-button (click)="navigate('/dashboard')">
            <mat-icon>dashboard</mat-icon>
            Dashboard
          </button>
          
          <button mat-button (click)="navigate('/parts')">
            <mat-icon>inventory</mat-icon>
            Parts
          </button>
          
          <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-button">
            <mat-icon>account_circle</mat-icon>
            {{ currentUser?.firstName || 'User' }}
            <mat-icon>expand_more</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="navigate('/profile')">
              <mat-icon>person</mat-icon>
              Profile
            </button>
            <button mat-menu-item (click)="navigate('/settings')">
              <mat-icon>settings</mat-icon>
              Settings
            </button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              Logout
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      background: var(--surface-color);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .toolbar-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .user-menu-button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--surface-variant);
      border-radius: 8px;
    }

    button[mat-button] {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    button[mat-button]:hover {
      background: var(--surface-variant);
    }

    @media (max-width: 768px) {
      .toolbar-content {
        padding: 0 1rem;
      }
      
      .logo-text {
        display: none;
      }
      
      .nav-section button span {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}