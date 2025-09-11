import { useEffect, useRef } from 'react';

export const useLayoutFocus = () => {
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layoutRef.current) {
      layoutRef.current.focus();
    }

    const onChangeVisibility = () => {
      if (document.visibilityState === 'visible') {
        layoutRef.current?.focus();
      }
    };

    window.addEventListener('visibilitychange', onChangeVisibility);

    return () => window.removeEventListener('visibilitychange', onChangeVisibility);
  }, [layoutRef]);

  return layoutRef;
};
