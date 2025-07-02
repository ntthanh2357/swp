export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'advisor' | 'admin';
  status: 'active' | 'inactive' | 'pending' | 'banned';
  createdAt: Date;
  lastLogin?: Date;
  profileComplete: boolean;
  emailVerified: boolean;
  avatar?: string;
}

export interface AdminScholarship {
  id: string;
  title: string;
  provider: string;
  amount: number;
  currency: string;
  deadline: Date;
  country: string;
  status: 'active' | 'inactive' | 'expired' | 'draft';
  applications: number;
  createdBy: string;
  createdAt: Date;
  featured: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalAdvisors: number;
  totalScholarships: number;
  activeScholarships: number;
  totalApplications: number;
  monthlyGrowth: {
    users: number;
    scholarships: number;
    applications: number;
  };
}

export interface RouteParams {
  id: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}