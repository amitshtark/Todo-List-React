import { useEffect } from 'react';

/**
 * Sets document title with app suffix.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · TaskFlow` : 'TaskFlow';
    return () => { document.title = 'TaskFlow'; };
  }, [title]);
}
