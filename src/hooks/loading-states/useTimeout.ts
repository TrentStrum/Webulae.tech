```typescript
import { useEffect, useRef, useCallback } from 'react';

interface TimeoutOptions {
  onTimeout: () => void;
  duration?: number;
  resetOnChange?: boolean;
}

export function useTimeout({ 
  onTimeout, 
  duration = 30000, // 30 seconds default
  resetOnChange = true 
}: TimeoutOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const set = useCallback(() => {
    clear();
    timeoutRef.current = setTimeout(onTimeout, duration);
  }, [clear, duration, onTimeout]);

  useEffect(() => {
    if (resetOnChange) {
      set();
    }
    return clear;
  }, [clear, set, resetOnChange]);

  return { 
    set,
    clear,
    reset: set 
  };
}
```;
