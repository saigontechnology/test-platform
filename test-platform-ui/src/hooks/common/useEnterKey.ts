import { useCallback, useEffect } from 'react';

function useEnterKey(onEnter: () => void): void {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      onEnter();
    }
  }, [onEnter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

export default useEnterKey;
