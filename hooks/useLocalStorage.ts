'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with SSR safety
 * Generic and reusable for any data type
 */

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);

  // Wait for client-side hydration
  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setStoredValue(JSON.parse(stored));
      } catch {
        // If parsing fails, keep initial value
        setStoredValue(initialValue);
      }
    }
  }, [key, initialValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
