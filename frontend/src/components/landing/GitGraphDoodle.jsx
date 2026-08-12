export default function GitGraphDoodle({ variant, style }) {
  const renderContent = () => {
    switch (variant) {
      case 'top-left':
        return (
          <g stroke="var(--color-text-secondary)" opacity="0.4" fill="none">
            {/* Vertical main line with branch */}
            <line x1="60" y1="20" x2="60" y2="280" strokeWidth="1.5" />
            <circle cx="60" cy="40" r="6" strokeWidth="1.5" />
            <circle cx="60" cy="100" r="6" strokeWidth="1.5" />
            <path d="M 60 130 Q 90 130 90 160 Q 90 190 120 190" strokeWidth="1.5" />
            <circle cx="120" cy="190" r="6" strokeWidth="1.5" />
            <circle cx="60" cy="220" r="6" strokeWidth="1.5" />
          </g>
        );
      case 'top-right':
        return (
          <g stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.25">
            {/* Stacked code lines */}
            <line x1="20" y1="40" x2="140" y2="40" />
            <line x1="50" y1="60" x2="160" y2="60" />
            <line x1="50" y1="80" x2="130" y2="80" />
            <line x1="50" y1="100" x2="150" y2="100" />
            <line x1="20" y1="130" x2="90" y2="130" />
            <line x1="20" y1="150" x2="110" y2="150" />
          </g>
        );
      case 'bottom-left':
        return (
          <g stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.4" fill="none">
            {/* Curving horizontal line with circles and code lines */}
            <path d="M 20 50 Q 50 50 60 80 T 100 110 L 160 110" />
            <circle cx="100" cy="110" r="6" />
            <circle cx="140" cy="110" r="6" />
            {/* Corner code lines */}
            <line x1="80" y1="150" x2="80" y2="220" />
            <line x1="80" y1="160" x2="130" y2="160" />
            <line x1="80" y1="180" x2="150" y2="180" />
          </g>
        );
      case 'bottom-right':
        return (
          <g stroke="var(--color-text-secondary)" strokeWidth="1.5" opacity="0.4" fill="none">
            {/* Vertical line branching left, and a star */}
            <line x1="140" y1="20" x2="140" y2="150" />
            <circle cx="140" cy="100" r="6" />
            <path d="M 140 60 Q 110 60 110 30 L 110 0" />
            <circle cx="110" cy="30" r="6" />
            <path d="M 80 180 Q 90 180 90 170 Q 90 180 100 180 Q 90 180 90 190 Q 90 180 80 180" fill="var(--color-text-secondary)" stroke="none" opacity="0.8" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <svg
      viewBox="0 0 200 300"
      className="git-graph-doodle absolute pointer-events-none"
      style={style}
      aria-hidden="true"
    >
      {renderContent()}
    </svg>
  );
}
