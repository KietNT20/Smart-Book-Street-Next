import { clsx, type ClassValue } from 'clsx';
import dayjs from 'dayjs';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
    maximumFractionDigits: 0,
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

export function formatSummaryAddress(
  text: string,
  maxLength: number = 50
): string {
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

export function formatDateVi(date: Date | string | null): string {
  if (date === null) return '';
  return dayjs(new Date(date)).format('DD/MM/YYYY');
}

/**
 * Vietnam phone number formatter
 * @param phoneNumber Phone number string to be formatted
 * @returns Formatted phone number string
 */
export const formatVNPhoneNumber = (phoneNumber: string | number): string => {
  // Convert number to string and remove all non-numeric characters
  const phone = String(phoneNumber).replace(/\D/g, '');

  // Processing based on phone number length
  if (phone.length === 8) {
    // Length 8: 098 76543
    return `${phone.slice(0, 3)} ${phone.slice(3, 8)}`;
  } else if (phone.length === 10) {
    // Length 10: 098 765 4321
    return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
  } else if (phone.length === 11) {
    // Length 11: 098 7654 3211
    return `${phone.slice(0, 3)} ${phone.slice(3, 7)} ${phone.slice(7)}`;
  } else if (phone.length === 9) {
    // Length 9 (not having 0 at the beginning): 98 765 4321
    return `${phone.slice(0, 2)} ${phone.slice(2, 5)} ${phone.slice(5)}`;
  } else if (phone.length > 11) {
    // If too long, it may have country code
    if (phone.startsWith('84')) {
      // If starting with 84 (Vietnam code)
      const localNumber = phone.startsWith('840')
        ? '0' + phone.slice(3) // Case 840...
        : '0' + phone.slice(2); // Case 84...

      return formatVNPhoneNumber(localNumber); // Call recursively with the converted number
    } else {
      // Handle other cases
      return `${phone.slice(0, 4)} ${phone.slice(4, 8)} ${phone.slice(8)}`;
    }
  } else {
    // Case unclear length, split into groups of 3-4 digits
    let formatted = '';
    let i = 0;

    while (i < phone.length) {
      const groupLength = phone.length - i >= 4 && i > 0 ? 4 : 3;
      const group = phone.slice(i, i + groupLength);
      formatted += group + (i + groupLength < phone.length ? ' ' : '');
      i += groupLength;
    }

    return formatted;
  }
};
