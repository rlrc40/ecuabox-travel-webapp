import { useState, useEffect } from "react";

type UseSessionStorageType<T> = [T, (value: T) => void];

export const useSessionStorage = <T>(
  key: string,
  initialValue: T,
): UseSessionStorageType<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    window.sessionStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
