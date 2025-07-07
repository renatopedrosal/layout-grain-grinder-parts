import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GrainGrinderPartsService } from '../../services/grain-grinder-parts.service';
import { GrainGrinderPart, PartCategory, PartFilter } from '../../models/grain-grinder-part.model';

@Component({
  selector: 'app-parts-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  template: `
    <div class="parts-container">
      <div class="parts-header">
        <h1>Parts Management</h1>
        <button mat-raised-button color="primary" (click)="addNewPart()">
          <mat-icon>add</mat-icon>
          Add New Part
        </button>
      </div>

      <mat-card class="filter-card">
        <mat-card-header>
          <mat-card-title>Filter & Search</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="filter-grid">
            <mat-form-field appearance="outline">
              <mat-label>Search</mat-label>
              <input matInput [(ngModel)]="filter.searchTerm" 
                     (ngModelChange)="applyFilter()" 
                     placeholder="Search parts...">
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Category</mat-label>
              <mat-select [(ngModel)]="filter.category" (ngModelChange)="applyFilter()">
                <mat-option value="">All Categories</mat-option>
                <mat-option *ngFor="let category of categories" [value]="category">
                  {{ category | titlecase }}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Manufacturer</mat-label>
              <input matInput [(ngModel)]="filter.manufacturer" 
                     (ngModelChange)="applyFilter()" 
                     placeholder="Filter by manufacturer">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Min Price</mat-label>
              <input matInput type="number" [(ngModel)]="filter.minPrice" 
                     (ngModelChange)="applyFilter()" 
                     placeholder="0">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Max Price</mat-label>
              <input matInput type="number" [(ngModel)]="filter.maxPrice" 
                     (ngModelChange)="applyFilter()" 
                     placeholder="999999">
            </mat-form-field>

            <div class="filter-actions">
              <button mat-button (click)="clearFilters()">
                <mat-icon>clear</mat-icon>
                Clear Filters
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <div class="parts-grid">
        <mat-card *ngFor="let part of filteredParts" class="part-card hover-lift">
          <mat-card-header>
            <mat-card-title>{{ part.name }}</mat-card-title>
            <mat-card-subtitle>{{ part.partNumber }}</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div class="part-details">
              <div class="detail-row">
                <span class="label">Category:</span>
                <mat-chip-set>
                  <mat-chip>{{ part.category | titlecase }}</mat-chip>
                </mat-chip-set>
              </div>
              
              <div class="detail-row">
                <span class="label">Manufacturer:</span>
                <span>{{ part.manufacturer }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Price:</span>
                <span class="price">\${{ part.price | number:'1.2-2' }}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Stock:</span>
                <span class="stock" [class.low-stock]="part.stockQuantity < 10">
                  {{ part.stockQuantity }} units
                </span>
              </div>
              
              <div class="description">
                <p>{{ part.description }}</p>
              </div>
              
              <div class="compatibility" *ngIf="part.compatibility.length > 0">
                <span class="label">Compatible with:</span>
                <div class="compatibility-chips">
                  <mat-chip-set>
                    <mat-chip *ngFor="let model of part.compatibility">{{ model }}</mat-chip>
                  </mat-chip-set>
                </div>
              </div>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-button color="primary" (click)="viewPart(part.id)">
              <mat-icon>visibility</mat-icon>
              View
            </button>
            <button mat-button color="accent" (click)="editPart(part.id)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button color="warn" (click)="deletePart(part.id)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div *ngIf="filteredParts.length === 0" class="no-parts">
        <mat-icon>inventory_2</mat-icon>
        <h3>No parts found</h3>
        <p>Try adjusting your filters or add a new part.</p>
      </div>
    </div>
  `,
  styles: [`
    .parts-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .parts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .parts-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .filter-card {
      margin-bottom: 2rem;
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
    }

    .filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
    }

    .filter-actions {
      display: flex;
      align-items: center;
    }

    .parts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .part-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .part-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .label {
      font-weight: 600;
      color: var(--text-secondary);
    }

    .price {
      font-weight: 700;
      color: var(--primary-color);
      font-size: 1.1rem;
    }

    .stock {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      background: var(--success-color);
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .stock.low-stock {
      background: var(--warn-color);
    }

    .description {
      margin-top: 0.5rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-color);
    }

    .description p {
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .compatibility {
      margin-top: 0.5rem;
    }

    .compatibility-chips {
      margin-top: 0.5rem;
    }

    mat-chip {
      margin-right: 0.5rem;
    }

    .no-parts {
      text-align: center;
      padding: 3rem;
      color: var(--text-secondary);
    }

    .no-parts mat-icon {
      font-size: 4rem;
      height: 4rem;
      width: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .no-parts h3 {
      margin-bottom: 0.5rem;
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .parts-container {
        padding: 1rem;
      }
      
      .parts-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .parts-grid {
        grid-template-columns: 1fr;
      }
      
      .filter-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PartsListComponent implements OnInit {
  parts: GrainGrinderPart[] = [];
  filteredParts: GrainGrinderPart[] = [];
  categories = Object.values(PartCategory);
  
  filter: PartFilter = {
    searchTerm: '',
    category: undefined,
    manufacturer: '',
    minPrice: undefined,
    maxPrice: undefined,
    inStock: false
  };

  constructor(
    private partsService: GrainGrinderPartsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadParts();
  }

  private loadParts(): void {
    this.partsService.getAllParts().subscribe(parts => {
      this.parts = parts;
      this.filteredParts = parts;
    });
  }

  applyFilter(): void {
    this.partsService.searchParts(this.filter).subscribe(parts => {
      this.filteredParts = parts;
    });
  }

  clearFilters(): void {
    this.filter = {
      searchTerm: '',
      category: undefined,
      manufacturer: '',
      minPrice: undefined,
      maxPrice: undefined,
      inStock: false
    };
    this.filteredParts = this.parts;
  }

  addNewPart(): void {
    this.router.navigate(['/parts/new']);
  }

  viewPart(id: string): void {
    this.router.navigate(['/parts', id]);
  }

  editPart(id: string): void {
    this.router.navigate(['/parts', id, 'edit']);
  }

  deletePart(id: string): void {
    if (confirm('Are you sure you want to delete this part?')) {
      this.partsService.deletePart(id).subscribe(() => {
        this.loadParts();
      });
    }
  }
}