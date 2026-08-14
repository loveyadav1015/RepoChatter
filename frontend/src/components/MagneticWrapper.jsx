import React from 'react';
import { useMagneticHover } from '../hooks/useMagneticHover';

export default function MagneticWrapper({ children, strength = 40, radius = 250, className = '' }) {
  const magneticRef = useMagneticHover(strength, radius);
  
  return (
    <div ref={magneticRef} className={`inline-block ${className}`}>
      {children}
    </div>
  );
}
