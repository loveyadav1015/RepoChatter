import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function useMagneticHover(strength = 20, radius = 200) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    function handleMouseMove(e) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX ** 2 + distY ** 2);

      if (distance < radius) {
        const pullStrength = (1 - distance / radius) * strength;
        xTo((distX / distance) * pullStrength || 0);
        yTo((distY / distance) * pullStrength || 0);
      } else {
        xTo(0);
        yTo(0);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength, radius]);

  return ref;
}
