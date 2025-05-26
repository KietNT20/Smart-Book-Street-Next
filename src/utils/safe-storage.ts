export const safeStorage = {
  // Check if we're in browser environment
  isClient: typeof window !== 'undefined',

  // Safe getItem
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null; // Server-side: return null
    }

    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },

  // Safe setItem
  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') {
      return false; // Server-side: do nothing
    }

    try {
      window.localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  },

  // Safe removeItem
  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') {
      return false; // Server-side: do nothing
    }

    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
      return false;
    }
  },

  // Check if localStorage is available
  isAvailable: (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const testKey = '__localStorage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },
};
