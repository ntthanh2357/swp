export interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  currency: string;
  deadline: Date;
  country: string;
  fieldOfStudy: string[];
  academicLevel: string[];
  requirements: string[];
  description: string;
  applicationUrl: string;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  createdBy?: string;
  isSaved?: boolean;
}

export interface ScholarshipFormData {
  title: string;
  provider: string;
  amount: number;
  currency: string;
  deadline: string;
  country: string;
  fieldOfStudy: string[];
  academicLevel: string[];
  requirements: string[];
  description: string;
  applicationUrl: string;
  tags: string[];
  featured?: boolean;
}

export interface ScholarshipFilters {
  search?: string;
  country?: string;
  fieldOfStudy?: string;
  academicLevel?: string;
  sortBy?: 'deadline' | 'amount' | 'featured' | 'newest';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}