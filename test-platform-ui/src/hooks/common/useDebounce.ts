import { useCallback, useRef } from 'react';

function useDebounce(callback: any, delay: number) {
  const timer: any = useRef(null);

  const debouncedFunction = useCallback(
    (...args: any) => {
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
