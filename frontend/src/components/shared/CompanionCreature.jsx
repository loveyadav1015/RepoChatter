export default function CompanionCreature({ asleep }) {
  return (
    <svg viewBox="0 0 60 60" width="40" height="40" aria-hidden="true">
      <g opacity="0.9" fill="var(--color-text-primary)">
        {/* Legs */}
        <rect x="20" y="48" width="6" height="8" rx="3" />
        <rect x="34" y="48" width="6" height="8" rx="3" />
        
        {/* Arms */}
        <rect x="8" y="34" width="8" height="6" rx="3" transform="rotate(15 12 37)" />
        <rect x="44" y="34" width="8" height="6" rx="3" transform="rotate(-15 48 37)" />
        
        {/* Body and Ears */}
        <circle cx="30" cy="34" r="20" />
        <path d="M 14 22 L 20 8 L 26 22 Z" />
        <path d="M 34 22 L 40 8 L 46 22 Z" />
      </g>
      {asleep ? (
        <>
          <path d="M 21 32 Q 24 35 27 32" stroke="var(--color-bg)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 33 32 Q 36 35 39 32" stroke="var(--color-bg)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="24" cy="33" r="2.5" fill="var(--color-bg)" />
          <circle cx="36" cy="33" r="2.5" fill="var(--color-bg)" />
        </>
      )}
      <path d="M 27 40 Q 30 42 33 40" stroke="var(--color-bg)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
