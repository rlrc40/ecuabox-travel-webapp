import { useState, useEffect } from "react";

const WAY_CARE_STORAGE_KEY = "way-care";

type UseSessionStorageType<T> = [T, (value: T) => void];

export const useSessionStorage = <T>(
  key: string,
  initialValue: T,
): UseSessionStorageType<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (!window) return initialValue;

      const item =
        window?.sessionStorage.getItem(`${WAY_CARE_STORAGE_KEY}-${key}`) ||
        null;
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (window)
      window.sessionStorage.setItem(
        `${WAY_CARE_STORAGE_KEY}-${key}`,
        JSON.stringify(storedValue),
      );
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};
