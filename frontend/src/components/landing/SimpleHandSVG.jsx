export default function SimpleHandSVG() {
  return (
    <svg viewBox="0 0 300 400" className="hand-illustration absolute bottom-0 right-1/2 translate-x-1/4 w-[300px] h-[400px] md:w-[400px] md:h-[500px]" style={{ zIndex: 1 }} aria-hidden="true">
      {/* Simplified palm/fist shape */}
      <ellipse cx="150" cy="280" rx="90" ry="110" fill="var(--color-hand)" />
      {/* Simplified finger shapes wrapping around where the phone sits */}
      <rect x="70" y="180" width="35" height="120" rx="17" fill="var(--color-hand)" />
      <rect x="110" y="160" width="35" height="140" rx="17" fill="var(--color-hand)" />
      <rect x="150" y="160" width="35" height="140" rx="17" fill="var(--color-hand)" />
      <rect x="190" y="180" width="35" height="120" rx="17" fill="var(--color-hand)" />
      {/* Thumb */}
      <rect x="40" y="240" width="30" height="90" rx="15" fill="var(--color-hand)" transform="rotate(-20 55 285)" />
      {/* Subtle crease lines for minimal detail, not full shading */}
      <path d="M 90 200 Q 95 220 90 240" stroke="var(--color-hand-shadow)" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M 130 190 Q 135 220 130 250" stroke="var(--color-hand-shadow)" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}
