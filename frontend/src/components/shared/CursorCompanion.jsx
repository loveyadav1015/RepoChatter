import { useCursorCompanion } from '../../hooks/useCursorCompanion';
import CompanionCreature from './CompanionCreature';

export default function CursorCompanion() {
  const { ref, bodyRef, asleep } = useCursorCompanion();

  return (
    <div ref={ref} className="cursor-companion" aria-hidden="true">
      <div ref={bodyRef} className="companion-body">
        <CompanionCreature asleep={asleep} />
        {asleep && <span className="companion-zzz">Zzz</span>}
      </div>
    </div>
  );
}
