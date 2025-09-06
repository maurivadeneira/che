import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format dates in Spanish
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
}

/**
 * Calculate Kit2 expiration date (1 year from purchase)
 */
export function calculateKit2Expiration(purchaseDate: Date): Date {
  const expirationDate = new Date(purchaseDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);
  return expirationDate;
}

/**
 * Check if Kit2 is expired
 */
export function isKit2Expired(expirationDate: Date): boolean {
  return new Date() > expirationDate;
}
