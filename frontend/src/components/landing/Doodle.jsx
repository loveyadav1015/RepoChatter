export default function Doodle({ style, variant = 'squiggle' }) {
  const paths = {
    squiggle: 'M0,10 Q10,0 20,10 T40,10',
    loop: 'M0,20 C0,0 20,0 20,20 C20,40 0,40 0,20',
    dash: 'M0,10 L30,10',
  };
  return (
    <svg
      viewBox="0 0 40 40"
      className="absolute w-12 h-12"
      style={{ zIndex: 1, ...style }}
      aria-hidden="true"
    >
      <path
        d={paths[variant]}
        stroke="var(--color-doodle)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="var(--color-doodle-opacity)"
      />
    </svg>
  );
}
