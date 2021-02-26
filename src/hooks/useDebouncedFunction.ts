import { useEffect } from 'react';

/**
 * Hook taken from here (comment): https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
 */
export default function useDebouncedFunction(handler: () => void, watchedValue: any, delay: number) {
  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      handler();
    }, delay);
    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [watchedValue]);
}
