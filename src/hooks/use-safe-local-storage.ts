import { useEffect, useState } from 'react';

export const useSafeLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, boolean] => {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get value from localStorage on client-side
  useEffect(() => {
    if (isClient) {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn('Error reading from localStorage:', error);
      }
    }
  }, [key, isClient]);

  // Set value in localStorage
  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue, isClient];
};
