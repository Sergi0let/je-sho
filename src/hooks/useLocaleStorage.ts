import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => {
    try {
      // Перевіряємо, чи код виконується в браузері
      if (typeof window === "undefined") {
        return typeof initialValue === "function"
          ? (initialValue as () => T)()
          : initialValue;
      }

      const jsonValue = localStorage.getItem(key);
      if (jsonValue !== null) return JSON.parse(jsonValue);

      return typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue;
    } catch (error) {
      console.warn(error);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(error);
    }
  }, [key, value]);

  return [value, setValue] as [T, typeof setValue];
}
