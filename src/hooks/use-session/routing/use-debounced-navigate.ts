
import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { debounce } from '@/lib/utils';

/**
 * Hook that provides a debounced navigation function to prevent redirect loops
 */
export const useDebouncedNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return useCallback(
    debounce((path: string) => {
      // Only navigate if we're not already on this path
      if (currentPath !== path) {
        console.log(`Debounced navigate to ${path}`);
        navigate(path, { replace: true });
      } else {
        console.log(`Already at ${path}, skipping navigation`);
      }
    }, 800),
    [navigate, currentPath]
  );
};
