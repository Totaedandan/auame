import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {},
): [React.RefObject<T | null>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsIntersecting(true);
        observer.disconnect();
      }
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [targetRef, isIntersecting];
};
