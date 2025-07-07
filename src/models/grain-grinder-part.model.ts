export interface GrainGrinderPart {
  id: string;
  name: string;
  description: string;
  partNumber: string;
  category: PartCategory;
  price: number;
  stockQuantity: number;
  manufacturer: string;
  compatibility: string[];
  imageUrl?: string;
  specifications: PartSpecification[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PartSpecification {
  name: string;
  value: string;
  unit?: string;
}

export enum PartCategory {
  MOTOR = 'motor',
  BLADE = 'blade',
  HOUSING = 'housing',
  BEARING = 'bearing',
  BELT = 'belt',
  SWITCH = 'switch',
  SEAL = 'seal',
  SCREW = 'screw',
  GASKET = 'gasket',
  OTHER = 'other'
}

export interface PartFilter {
  category?: PartCategory;
  manufacturer?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  searchTerm?: string;
}