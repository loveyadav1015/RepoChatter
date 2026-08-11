import { useCursorGlow } from '../hooks/useCursorGlow';

export default function CursorGlow() {
  const glowRef = useCursorGlow();
  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
