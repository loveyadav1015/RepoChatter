import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import GitGraphDoodle from './GitGraphDoodle';
import { useMagneticHover } from '../../hooks/useMagneticHover';
import MagneticWrapper from '../MagneticWrapper';

export default function TitleSection({ onComplete }) {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const subtitleRef = useRef(null);
  const doodlesRef = useRef(null);
  const magneticRef = useMagneticHover(40, 250); // Stronger effect

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set([leftRef.current, rightRef.current, subtitleRef.current, doodlesRef.current], {
          x: 0, y: 0, rotation: 0, opacity: 1,
        });
        if (onComplete) onComplete();
        return;
      }

      const tl = gsap.timeline({ 
        defaults: { ease: 'back.out(1.2)' },
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      gsap.set(leftRef.current, { x: '-60vw', y: 0, rotation: -15, opacity: 0 });
      gsap.set(rightRef.current, { x: '60vw', y: 0, rotation: 15, opacity: 0 });
      gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
      gsap.set(doodlesRef.current, { opacity: 0 });

      tl.to(leftRef.current, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 2.5 })
        .to(rightRef.current, { x: 0, y: 0, rotation: 0, opacity: 1, duration: 2.5 }, '<')
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, '+=0')
        .to(doodlesRef.current, { opacity: 1, duration: 1.2, ease: 'power2.out' }, '<');
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <section className="title-section">
      <div ref={doodlesRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <GitGraphDoodle variant="top-left" style={{ left: '4%', top: '5%', width: '160px' }} />
        <GitGraphDoodle variant="top-right" style={{ right: '4%', top: '15%', width: '200px' }} />
        <GitGraphDoodle variant="bottom-left" style={{ left: '8%', bottom: '5%', width: '180px' }} />
        <GitGraphDoodle variant="bottom-right" style={{ right: '8%', bottom: '10%', width: '160px' }} />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-none">
        <h1 ref={magneticRef} className="hero-title hero-title-hoverable mb-6 pointer-events-auto">
          <span ref={leftRef} className="hero-title-left">Repo</span>
          <span ref={rightRef} className="hero-title-right">Chatter</span>
          
          <span className="hero-title-strike" aria-hidden="true">
            <span>Repo</span>
            <span>Chatter</span>
          </span>
        </h1>
        <MagneticWrapper strength={20}>
          <p ref={subtitleRef} className="hero-subtitle pointer-events-auto m-0">
            Ask questions about any GitHub repository and get<br className="hidden md:block" />
            answers grounded in its README.
          </p>
        </MagneticWrapper>
      </div>
    </section>
  );
}
