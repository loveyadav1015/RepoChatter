import { useState, useEffect } from 'react';
import { useCursorCompanion } from '../../hooks/useCursorCompanion';
import CompanionCreature from './CompanionCreature';

export default function CursorCompanion() {
  const { ref, bodyRef, asleep } = useCursorCompanion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If not starting on the homepage, show immediately
    if (window.location.pathname !== '/') {
      setVisible(true);
      return;
    }

    const handleEntrance = () => setVisible(true);
    window.addEventListener('entrance-complete', handleEntrance);
    
    // Safety fallback just in case the event is missed
    const timeout = setTimeout(() => setVisible(true), 4000);

    return () => {
      window.removeEventListener('entrance-complete', handleEntrance);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`cursor-companion transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`} 
      aria-hidden="true"
    >
      <div ref={bodyRef} className="companion-body">
        <CompanionCreature asleep={asleep} />
        {asleep && <span className="companion-zzz">Zzz</span>}
      </div>
    </div>
  );
}
