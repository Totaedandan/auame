import type { ReactNode } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
};

export const FadeIn = ({ children, delay = 0, direction = 'up' }: FadeInProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  const translateClass =
    direction === 'up'
      ? 'translate-y-10'
      : direction === 'left'
      ? '-translate-x-10'
      : 'translate-x-10';

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${translateClass}`
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};
