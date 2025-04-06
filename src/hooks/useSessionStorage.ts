import { useState, useEffect } from "react";

type UseSessionStorageType<T> = [T, (value: T) => void];

export const useSessionStorage = <T>(
  key: string,
  initialValue: T,
): UseSessionStorageType<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (!window) return initialValue;

      const item = window?.sessionStorage.getItem(key) || null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (window) window.sessionStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
