import { useEffect, useState } from "react";

export function useSSRLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const jsonValue = localStorage.getItem(key);
      return jsonValue !== null ? JSON.parse(jsonValue) : initialValue;
    } catch (error) {
      console.warn(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as const;
}
