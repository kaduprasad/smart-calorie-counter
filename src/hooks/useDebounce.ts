import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the input value.
 * Updates only after the specified delay of inactivity.
 *
 * @param value  The value to debounce
 * @param delay  Debounce delay in milliseconds (default: 1500)
 */
export function useDebounce<T>(value: T, delay = 1500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
