import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export function useGsapReveal(type = 'entrance') {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        gsap.set(ref.current, { opacity: 1, y: 0, scale: 1 });
        return;
      }

      if (type === 'entrance') {
        gsap.from(ref.current, { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' });
      } else if (type === 'message') {
        gsap.from(ref.current, { opacity: 0, y: 12, duration: 0.35, ease: 'power2.out' });
      }
    }, ref);

    return () => ctx.revert();
  }, [type]);

  return ref;
}

export function useGsapStagger(selector) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        gsap.set(selector, { opacity: 1, y: 0 });
        return;
      }

      gsap.from(selector, { opacity: 0, y: 16, stagger: 0.08, duration: 0.4, ease: 'power2.out' });
    }, ref);

    return () => ctx.revert();
  }, [selector]);

  return ref;
}
