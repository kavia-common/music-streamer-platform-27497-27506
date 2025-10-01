import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useDebounce
 * Returns a debounced version of a value that updates after the specified delay.
 *
 * @param value any - the input value to debounce
 * @param delay number - delay in milliseconds (default: 300ms)
 * @returns debouncedValue
 */
export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
