import { useState, useEffect } from 'react';

export default function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        if (parsed === null && defaultValue !== null) {
          return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        }
        return parsed;
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}
