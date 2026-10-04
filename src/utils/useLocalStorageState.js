import { useState, useEffect } from 'react';
import { safeStorage } from './safeStorage';

export default function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const item = safeStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        if (parsed === null && defaultValue !== null) {
          return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        }
        return parsed;
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    } catch (error) {
      console.warn(`[useLocalStorageState] Error reading key "${key}":`, error);
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });

  useEffect(() => {
    try {
      safeStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`[useLocalStorageState] Error writing key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}
