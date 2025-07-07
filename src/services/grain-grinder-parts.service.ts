import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { GrainGrinderPart, PartCategory, PartFilter } from '../models/grain-grinder-part.model';

@Injectable({
  providedIn: 'root'
})
export class GrainGrinderPartsService {
  private partsSubject = new BehaviorSubject<GrainGrinderPart[]>([]);
  public parts$ = this.partsSubject.asObservable();

  private mockParts: GrainGrinderPart[] = [
    {
      id: '1',
      name: 'High-Speed Motor Assembly',
      description: 'Professional grade motor for heavy-duty grain grinding',
      partNumber: 'GM-MOT-001',
      category: PartCategory.MOTOR,
      price: 299.99,
      stockQuantity: 15,
      manufacturer: 'GrainTech',
      compatibility: ['GT-2000', 'GT-3000', 'GT-Pro'],
      specifications: [
        { name: 'Power', value: '1800', unit: 'W' },
        { name: 'RPM', value: '3600', unit: 'rpm' },
        { name: 'Voltage', value: '220', unit: 'V' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Tungsten Carbide Blade Set',
      description: 'Ultra-sharp blades for efficient grain processing',
      partNumber: 'GM-BLD-002',
      category: PartCategory.BLADE,
      price: 89.99,
      stockQuantity: 32,
      manufacturer: 'BladeMax',
      compatibility: ['GT-2000', 'GT-3000', 'BM-500'],
      specifications: [
        { name: 'Material', value: 'Tungsten Carbide' },
        { name: 'Diameter', value: '150', unit: 'mm' },
        { name: 'Thickness', value: '3', unit: 'mm' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Precision Ball Bearings',
      description: 'High-performance bearings for smooth operation',
      partNumber: 'GM-BRG-003',
      category: PartCategory.BEARING,
      price: 45.50,
      stockQuantity: 28,
      manufacturer: 'BearingPro',
      compatibility: ['GT-2000', 'GT-3000', 'GT-Pro', 'BM-500'],
      specifications: [
        { name: 'Type', value: 'Deep Groove Ball Bearing' },
        { name: 'Inner Diameter', value: '20', unit: 'mm' },
        { name: 'Outer Diameter', value: '47', unit: 'mm' }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor() {
    this.partsSubject.next(this.mockParts);
  }

  getAllParts(): Observable<GrainGrinderPart[]> {
    return of(this.mockParts);
  }

  getPartById(id: string): Observable<GrainGrinderPart | undefined> {
    const part = this.mockParts.find(p => p.id === id);
    return of(part);
  }

  createPart(part: Omit<GrainGrinderPart, 'id' | 'createdAt' | 'updatedAt'>): Observable<GrainGrinderPart> {
    const newPart: GrainGrinderPart = {
      ...part,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockParts.push(newPart);
    this.partsSubject.next([...this.mockParts]);
    return of(newPart);
  }

  updatePart(id: string, updates: Partial<GrainGrinderPart>): Observable<GrainGrinderPart | null> {
    const index = this.mockParts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockParts[index] = {
        ...this.mockParts[index],
        ...updates,
        updatedAt: new Date()
      };
      this.partsSubject.next([...this.mockParts]);
      return of(this.mockParts[index]);
    }
    return of(null);
  }

  deletePart(id: string): Observable<boolean> {
    const index = this.mockParts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockParts.splice(index, 1);
      this.partsSubject.next([...this.mockParts]);
      return of(true);
    }
    return of(false);
  }

  searchParts(filter: PartFilter): Observable<GrainGrinderPart[]> {
    let filteredParts = [...this.mockParts];

    if (filter.category) {
      filteredParts = filteredParts.filter(part => part.category === filter.category);
    }

    if (filter.manufacturer) {
      filteredParts = filteredParts.filter(part => 
        part.manufacturer.toLowerCase().includes(filter.manufacturer!.toLowerCase())
      );
    }

    if (filter.minPrice !== undefined) {
      filteredParts = filteredParts.filter(part => part.price >= filter.minPrice!);
    }

    if (filter.maxPrice !== undefined) {
      filteredParts = filteredParts.filter(part => part.price <= filter.maxPrice!);
    }

    if (filter.inStock) {
      filteredParts = filteredParts.filter(part => part.stockQuantity > 0);
    }

    if (filter.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredParts = filteredParts.filter(part =>
        part.name.toLowerCase().includes(searchTerm) ||
        part.description.toLowerCase().includes(searchTerm) ||
        part.partNumber.toLowerCase().includes(searchTerm)
      );
    }

    return of(filteredParts);
  }
}