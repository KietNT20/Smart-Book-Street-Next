import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

export const formatPrice = (
  price: number | string,
  options?: {
    withSymbol?: boolean;
    compact?: boolean;
  }
) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return '0 ₫';
  }

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: options?.withSymbol === false ? 'decimal' : 'currency',
    currency: 'VND',
    notation: options?.compact ? 'compact' : 'standard',
    maximumFractionDigits: 0
  });

  return formatter.format(numPrice);
};

/**
 * Format text to a short summary with ellipsis if needed
 */
export function formatSummary(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Convert utc date to local date string
 */
export function utcToLocalDate(utcDateString: string): string {
  try {
    const date = new Date(utcDateString);
    return date.toLocaleDateString('vi-VN');
  } catch {
    return utcDateString;
  }
}
