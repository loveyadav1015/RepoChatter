export default function GitGraphDoodle({ style, flipped = false }) {
  return (
    <svg
      viewBox="0 0 200 300"
      className="git-graph-doodle absolute"
      style={{ ...style, transform: flipped ? 'scaleX(-1)' : 'none' }}
      aria-hidden="true"
    >
      {/* Vertical main line with branch, matching reference's left-side graph */}
      <line x1="30" y1="20" x2="30" y2="280" stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="30" cy="40" r="6" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="30" cy="100" r="6" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.5" />
      <path d="M 30 130 Q 60 130 60 160 Q 60 190 90 190" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="90" cy="190" r="6" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.5" />
      <circle cx="30" cy="220" r="6" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.5" />

      {/* Horizontal "text line" groups, matching reference's right-side stacked lines */}
      <g transform="translate(0, 250)" opacity="0.35">
        <line x1="0" y1="0" x2="80" y2="0" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
        <line x1="0" y1="15" x2="55" y2="15" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
        <line x1="0" y1="30" x2="65" y2="30" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
