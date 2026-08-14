import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const LAG_FACTOR = 0.012;
const CATCH_DISTANCE = 10;
const CATCH_HOLD_MS = 600;
const WAKE_DISTANCE = 20;

export function useCursorCompanion() {
  const ref = useRef(null);
  const bodyRef = useRef(null);
  const asleepRef = useRef(false);
  const [asleep, setAsleepState] = useState(false);

  function setAsleep(value) {
    asleepRef.current = value;
    setAsleepState(value);
  }

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(hover: none)').matches;
    if (prefersReduced || isTouchDevice) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let caughtSince = null;
    let walkPhase = 0;

    function handleMouseMove(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > WAKE_DISTANCE && asleepRef.current) {
        caughtSince = null;
        setAsleep(false);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);

    function tick() {
      const dx = mouse.x - pos.x;
      const dy = mouse.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (!asleepRef.current) {
        pos.x += dx * LAG_FACTOR;
        pos.y += dy * LAG_FACTOR;
      }

      if (ref.current) {
        gsap.set(ref.current, { x: pos.x - 20, y: pos.y - 20 });
      }

      const speed = Math.sqrt((dx * LAG_FACTOR) ** 2 + (dy * LAG_FACTOR) ** 2);
      const isMoving = !asleepRef.current && speed > 0.15;

      if (isMoving && bodyRef.current) {
        walkPhase += 0.25;
        const bobY = Math.sin(walkPhase) * 3;
        const tilt = Math.sin(walkPhase) * 4;
        gsap.set(bodyRef.current, { y: bobY, rotation: tilt });
      } else if (bodyRef.current) {
        gsap.set(bodyRef.current, { y: 0, rotation: 0 });
      }

      if (distance < CATCH_DISTANCE) {
        if (caughtSince === null) caughtSince = performance.now();
        if (!asleepRef.current && performance.now() - caughtSince > CATCH_HOLD_MS) {
          setAsleep(true);
        }
      } else {
        caughtSince = null;
      }
    }

    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(tick);
    };
  }, []);

  return { ref, bodyRef, asleep };
}
