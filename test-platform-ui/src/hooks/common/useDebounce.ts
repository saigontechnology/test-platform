import { useCallback, useRef } from 'react';

function useDebounce(callback: any, delay: number) {
  const timer = useRef(null);

  const debouncedFunction = useCallback(
    (...args) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedFunction;
}

export default useDebounce;
