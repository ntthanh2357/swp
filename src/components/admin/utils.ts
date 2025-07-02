import { ValidationResult } from './types';

export const validateId = (id: string | undefined): ValidationResult => {
  if (!id) {
    return { isValid: false, error: 'ID is required' };
  }

  if (typeof id !== 'string') {
    return { isValid: false, error: 'ID must be a string' };
  }

  if (id.trim().length === 0) {
    return { isValid: false, error: 'ID cannot be empty' };
  }

  // Check for valid UUID format (basic check)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isUuid = uuidRegex.test(id);
  
  // For demo purposes, also allow simple numeric/alphanumeric IDs
  const isSimpleId = /^[a-zA-Z0-9-_]+$/.test(id);

  if (!isUuid && !isSimpleId) {
    return { isValid: false, error: 'Invalid ID format' };
  }

  return { isValid: true };
};

export const validateNumericId = (id: string | undefined): ValidationResult => {
  if (!id) {
    return { isValid: false, error: 'ID is required' };
  }

  const numericId = parseInt(id, 10);
  if (isNaN(numericId) || numericId <= 0) {
    return { isValid: false, error: 'ID must be a positive number' };
  }

  return { isValid: true };
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'banned':
      return 'bg-red-100 text-red-800';
    case 'expired':
      return 'bg-red-100 text-red-800';
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};