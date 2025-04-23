import { STORAGE } from '@/constant/storage';
import Cookies from 'js-cookie';

type TokenTypes = {
  accessToken: string;
  refreshToken?: string;
};

type TokenMethodType = {
  get: () => TokenTypes | null;
  set: (token: TokenTypes) => void;
  remove: () => void;
};

// Local storage
export const localToken: TokenMethodType = {
  get: () => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem(STORAGE.token);
    return token ? JSON.parse(token) : null;
  },
  set: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE.token, JSON.stringify(token));
    }
  },
  remove: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE.token);
    }
  },
};

// Cookies
export const cookieToken: TokenMethodType = {
  get: () => {
    const tokenStr = Cookies.get(STORAGE.token);
    if (!tokenStr) return null;

    try {
      return JSON.parse(tokenStr);
    } catch (error) {
      console.error('Error parsing token from cookie:', error);
      return null;
    }
  },
  set: (token) => {
    Cookies.set(STORAGE.token, JSON.stringify(token), {
      expires: 30 * 24 * 60 * 60, // 30 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF protection
      // httpOnly: true,
    });
  },
  remove: () => Cookies.remove(STORAGE.token),
};

const tokenMethod: TokenMethodType = {
  get: () => {
    return cookieToken.get();
  },
  set: (token) => {
    // console.log('Setting token', token);
    cookieToken.set(token);
  },
  remove: () => {
    cookieToken.remove();
  },
};

export default tokenMethod;

/**
 * Safely gets an item from localStorage
 * @param key - The key to retrieve from localStorage
 * @param defaultValue - The default value to return if key doesn't exist or localStorage is not available
 * @returns The value from localStorage or the default value
 */
export const getLocalStorageItem = <T = string>(
  key: string,
  defaultValue: T = '' as T
): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = localStorage.getItem(key);
    return item !== null ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.error(`Error accessing localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely sets an item in localStorage
 * @param key - The key to set in localStorage
 * @param value - The value to store in localStorage
 * @returns true if successful, false otherwise
 */
export const setLocalStorageItem = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error setting localStorage for key "${key}":`, error);
    return false;
  }
};

/**
 * Safely removes an item from localStorage
 * @param key - The key to remove from localStorage
 * @returns true if successful, false otherwise
 */
export const removeLocalStorageItem = (key: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing localStorage for key "${key}":`, error);
    return false;
  }
};
