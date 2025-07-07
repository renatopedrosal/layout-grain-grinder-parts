import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { GrainGrinderPartsService } from '../../services/grain-grinder-parts.service';
import { GrainGrinderPart, PartCategory } from '../../models/grain-grinder-part.model';

@Component({
  selector: 'app-part-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="form-container">
      <div class="form-header">
        <h1>{{ isEditMode ? 'Edit Part' : 'Add New Part' }}</h1>
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back to Parts
        </button>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="partForm" (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Part Name</mat-label>
                <input matInput formControlName="name" placeholder="Enter part name">
                <mat-error *ngIf="partForm.get('name')?.hasError('required')">
                  Part name is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Part Number</mat-label>
                <input matInput formControlName="partNumber" placeholder="Enter part number">
                <mat-error *ngIf="partForm.get('partNumber')?.hasError('required')">
                  Part number is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category">
                  <mat-option *ngFor="let category of categories" [value]="category">
                    {{ category | titlecase }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="partForm.get('category')?.hasError('required')">
                  Category is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Manufacturer</mat-label>
                <input matInput formControlName="manufacturer" placeholder="Enter manufacturer">
                <mat-error *ngIf="partForm.get('manufacturer')?.hasError('required')">
                  Manufacturer is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Price</mat-label>
                <input matInput type="number" formControlName="price" placeholder="0.00">
                <span matPrefix>$</span>
                <mat-error *ngIf="partForm.get('price')?.hasError('required')">
                  Price is required
                </mat-error>
                <mat-error *ngIf="partForm.get('price')?.hasError('min')">
                  Price must be greater than 0
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Stock Quantity</mat-label>
                <input matInput type="number" formControlName="stockQuantity" placeholder="0">
                <mat-error *ngIf="partForm.get('stockQuantity')?.hasError('required')">
                  Stock quantity is required
                </mat-error>
                <mat-error *ngIf="partForm.get('stockQuantity')?.hasError('min')">
                  Stock quantity must be 0 or greater
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" 
                          placeholder="Enter part description" rows="3"></textarea>
                <mat-error *ngIf="partForm.get('description')?.hasError('required')">
                  Description is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Compatible Models</mat-label>
                <input matInput formControlName="compatibilityInput" 
                       placeholder="Enter compatible model and press Enter"
                       (keyup.enter)="addCompatibility()">
                <mat-hint>Press Enter to add a compatible model</mat-hint>
              </mat-form-field>

              <div class="compatibility-chips full-width" *ngIf="compatibility.length > 0">
                <mat-chip-set>
                  <mat-chip *ngFor="let model of compatibility; let i = index" 
                            (removed)="removeCompatibility(i)">
                    {{ model }}
                    <button matChipRemove>
                      <mat-icon>cancel</mat-icon>
                    </button>
                  </mat-chip>
                </mat-chip-set>
              </div>

              <div class="specifications-section full-width">
                <h3>Specifications</h3>
                <div formArrayName="specifications">
                  <div *ngFor="let spec of specifications.controls; let i = index" 
                       [formGroupName]="i" class="spec-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Name</mat-label>
                      <input matInput formControlName="name" placeholder="Specification name">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Value</mat-label>
                      <input matInput formControlName="value" placeholder="Specification value">
                    </mat-form-field>
                    
                    <mat-form-field appearance="outline">
                      <mat-label>Unit</mat-label>
                      <input matInput formControlName="unit" placeholder="Unit (optional)">
                    </mat-form-field>
                    
                    <button mat-icon-button color="warn" type="button" (click)="removeSpecification(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
                
                <button mat-button type="button" (click)="addSpecification()">
                  <mat-icon>add</mat-icon>
                  Add Specification
                </button>
              </div>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">
                Cancel
              </button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="partForm.invalid || isLoading">
                <mat-icon *ngIf="isLoading">refresh</mat-icon>
                {{ isLoading ? 'Saving...' : (isEditMode ? 'Update Part' : 'Create Part') }}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .form-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .form-card {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .compatibility-chips {
      margin-top: 1rem;
    }

    .specifications-section {
      margin-top: 2rem;
    }

    .specifications-section h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .spec-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 1rem;
      align-items: start;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border-color);
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 1rem;
      }
      
      .form-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .spec-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PartFormComponent implements OnInit {
  partForm: FormGroup;
  categories = Object.values(PartCategory);
  compatibility: string[] = [];
  isEditMode = false;
  isLoading = false;
  partId?: string;

  constructor(
    private fb: FormBuilder,
    private partsService: GrainGrinderPartsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.partForm = this.createForm();
  }

  ngOnInit(): void {
    this.partId = this.route.snapshot.paramMap.get('id') || undefined;
    this.isEditMode = !!this.partId;

    if (this.isEditMode && this.partId) {
      this.loadPart();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      partNumber: ['', [Validators.required]],
      category: ['', [Validators.required]],
      manufacturer: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]],
      compatibilityInput: [''],
      specifications: this.fb.array([])
    });
  }

  get specifications(): FormArray {
    return this.partForm.get('specifications') as FormArray;
  }

  private loadPart(): void {
    if (this.partId) {
      this.partsService.getPartById(this.partId).subscribe(part => {
        if (part) {
          this.partForm.patchValue(part);
          this.compatibility = [...part.compatibility];
          
          // Load specifications
          part.specifications.forEach(spec => {
            this.specifications.push(this.fb.group({
              name: [spec.name],
              value: [spec.value],
              unit: [spec.unit || '']
            }));
          });
        }
      });
    }
  }

  addCompatibility(): void {
    const input = this.partForm.get('compatibilityInput');
    if (input?.value && input.value.trim()) {
      this.compatibility.push(input.value.trim());
      input.setValue('');
    }
  }

  removeCompatibility(index: number): void {
    this.compatibility.splice(index, 1);
  }

  addSpecification(): void {
    this.specifications.push(this.fb.group({
      name: [''],
      value: [''],
      unit: ['']
    }));
  }

  removeSpecification(index: number): void {
    this.specifications.removeAt(index);
  }

  onSubmit(): void {
    if (this.partForm.valid) {
      this.isLoading = true;
      
      const formData = {
        ...this.partForm.value,
        compatibility: this.compatibility,
        specifications: this.specifications.value.filter((spec: any) => spec.name && spec.value)
      };
      
      delete formData.compatibilityInput;

      if (this.isEditMode && this.partId) {
        this.partsService.updatePart(this.partId, formData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/parts']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Update error:', error);
          }
        });
      } else {
        this.partsService.createPart(formData).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/parts']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Create error:', error);
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/parts']);
  }
}