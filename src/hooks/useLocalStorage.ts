import { useState, useEffect } from "react";

type UseLocalStorageType<T> = [T, (value: T) => void];

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): UseLocalStorageType<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
