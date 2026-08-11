import { useEffect, useRef } from 'react';

export function useCursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    function handleMouseMove(e) {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return glowRef;
}
