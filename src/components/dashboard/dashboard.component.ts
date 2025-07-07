import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { GrainGrinderPartsService } from '../../services/grain-grinder-parts.service';
import { GrainGrinderPart } from '../../models/grain-grinder-part.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p class="subtitle">Welcome to your grain grinder parts management system</p>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <h3>{{ totalParts }}</h3>
                <p>Total Parts</p>
              </div>
              <mat-icon class="stat-icon">inventory</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <h3>{{ inStockParts }}</h3>
                <p>In Stock</p>
              </div>
              <mat-icon class="stat-icon">check_circle</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <h3>{{ lowStockParts }}</h3>
                <p>Low Stock</p>
              </div>
              <mat-icon class="stat-icon">warning</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-content">
              <div class="stat-info">
                <h3>\${{ totalValue | number:'1.2-2' }}</h3>
                <p>Total Value</p>
              </div>
              <mat-icon class="stat-icon">attach_money</mat-icon>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="content-grid">
        <mat-card class="recent-parts-card">
          <mat-card-header>
            <mat-card-title>Recent Parts</mat-card-title>
            <mat-card-subtitle>Latest additions to inventory</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="parts-list">
              <div *ngFor="let part of recentParts" class="part-item">
                <div class="part-info">
                  <h4>{{ part.name }}</h4>
                  <p>{{ part.partNumber }} - {{ part.category }}</p>
                  <span class="price">\${{ part.price }}</span>
                </div>
                <div class="part-stock" [class.low-stock]="part.stockQuantity < 10">
                  {{ part.stockQuantity }} in stock
                </div>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="viewAllParts()">
              View All Parts
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="quick-actions-card">
          <mat-card-header>
            <mat-card-title>Quick Actions</mat-card-title>
            <mat-card-subtitle>Common tasks</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="actions-grid">
              <button mat-raised-button color="primary" (click)="addNewPart()">
                <mat-icon>add</mat-icon>
                Add New Part
              </button>
              <button mat-raised-button (click)="manageInventory()">
                <mat-icon>inventory_2</mat-icon>
                Manage Inventory
              </button>
              <button mat-raised-button (click)="viewReports()">
                <mat-icon>analytics</mat-icon>
                View Reports
              </button>
              <button mat-raised-button (click)="exportData()">
                <mat-icon>file_download</mat-icon>
                Export Data
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1.1rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-info h3 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.25rem;
    }

    .stat-info p {
      color: var(--text-secondary);
      font-weight: 500;
    }

    .stat-icon {
      font-size: 2.5rem;
      color: var(--primary-color);
      opacity: 0.7;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .recent-parts-card,
    .quick-actions-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
    }

    .parts-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .part-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-color);
    }

    .part-item:last-child {
      border-bottom: none;
    }

    .part-info h4 {
      color: var(--text-primary);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .part-info p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 0.25rem;
    }

    .price {
      font-weight: 600;
      color: var(--primary-color);
    }

    .part-stock {
      background: var(--success-color);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .part-stock.low-stock {
      background: var(--warn-color);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .actions-grid button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      height: auto;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .content-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalParts = 0;
  inStockParts = 0;
  lowStockParts = 0;
  totalValue = 0;
  recentParts: GrainGrinderPart[] = [];

  constructor(
    private partsService: GrainGrinderPartsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.partsService.getAllParts().subscribe(parts => {
      this.totalParts = parts.length;
      this.inStockParts = parts.filter(part => part.stockQuantity > 0).length;
      this.lowStockParts = parts.filter(part => part.stockQuantity < 10).length;
      this.totalValue = parts.reduce((sum, part) => sum + (part.price * part.stockQuantity), 0);
      this.recentParts = parts.slice(0, 5);
    });
  }

  viewAllParts(): void {
    this.router.navigate(['/parts']);
  }

  addNewPart(): void {
    this.router.navigate(['/parts/new']);
  }

  manageInventory(): void {
    this.router.navigate(['/inventory']);
  }

  viewReports(): void {
    this.router.navigate(['/reports']);
  }

  exportData(): void {
    // Implementation for data export
    console.log('Exporting data...');
  }
}