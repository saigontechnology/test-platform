import { useCallback, useRef } from 'react';

type DebouncedClickHandler = (event: React.MouseEvent) => void;

function useDebounced(handler: DebouncedClickHandler, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedHandler = useCallback(
    (event: React.MouseEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handler(event);
      }, delay);
    },
    [handler, delay]
  );

  return debouncedHandler;
}

export default useDebounced;
