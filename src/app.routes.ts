import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

const noAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { 
    path: 'parts', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/parts/parts-list.component').then(m => m.PartsListComponent)
  },
  { 
    path: 'parts/new', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/parts/part-form.component').then(m => m.PartFormComponent)
  },
  { 
    path: 'parts/:id/edit', 
    canActivate: [authGuard],
    loadComponent: () => import('./components/parts/part-form.component').then(m => m.PartFormComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];