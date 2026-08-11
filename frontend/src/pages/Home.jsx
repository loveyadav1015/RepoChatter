import { useState, useEffect, useRef } from 'react';
import { useGsapReveal } from '../hooks/useGsapReveal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { repos } from '../services/api';
import { toast } from 'sonner';
import RepoList from '../components/RepoList';

import PhoneMockup from '../components/landing/PhoneMockup';
import Doodle from '../components/landing/Doodle';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [repoData, setRepoData] = useState([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Pinned Timeline (Scene 1 -> Scene 2)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=250%', // Increased from 150% to give more scroll room
          scrub: 1,
          pin: true,
        }
      });

      // Scene 1: Fade out and scale down Title and Subtitle
      tl.to('.scene-1', {
        opacity: 0,
        scale: 0.9,
        duration: 1
      }, 0);

      // Scene 2: Slide up and fade in Phone and Doodles
      tl.fromTo('.scene-2', {
        y: '60%',
        opacity: 0,
        scale: 0.85
      }, {
        y: '0%',
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power1.out'
      }, 0.2);

      // Add "empty" duration to the end of the timeline. 
      // This forces the scene to stay pinned for a long time after the phone slides up, 
      // so the user doesn't accidentally scroll past it immediately to the repo list.
      tl.to({}, { duration: 2 });

      // 2. Repo List Entrance Animation (Scene 3)
      gsap.fromTo('.repo-list-container', {
        y: 100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.repo-list-container',
          start: 'top 80%', // Triggers when the repo list enters the bottom of the viewport
          toggleActions: 'play none none reverse'
        }
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  const fetchRepos = async () => {
    try {
      const res = await repos.list();
      setRepoData(res.data);
    } catch (err) {
      toast.error('Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" ref={mainRef}>

      <div ref={heroRef} className="relative h-screen w-full overflow-hidden bg-background">
        {/* SCENE 1: Title & Details */}
        <div className="scene-1 absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-20 pointer-events-none">
          <h1 className="hero-title mb-6">
            Repo Chatter
          </h1>
          <p className="hero-subtitle">
            Ask questions about any GitHub repository and get<br className="hidden md:block" />
            answers grounded in its README.
          </p>
        </div>

        {/* SCENE 2: Phone Mockup */}
        <div className="scene-2 absolute inset-0 z-30 flex items-center justify-center">
          <Doodle variant="squiggle" style={{ top: '10%', left: '8%' }} />
          <Doodle variant="loop" style={{ top: '15%', right: '10%' }} />
          <Doodle variant="dash" style={{ bottom: '20%', left: '12%' }} />
          <Doodle variant="squiggle" style={{ bottom: '15%', right: '8%' }} />

          <div className="hero-hand-phone-wrap h-full max-h-[800px] w-full max-w-[600px] pb-8 md:pb-16 pointer-events-auto">
            <PhoneMockup />
          </div>
        </div>
      </div>

      <main className="repo-list-container px-4 py-16 md:py-24 md:px-8 max-w-5xl mx-auto relative z-40 bg-background">
        {/* Removing Tracked Repositories subheader as per picture 2 */}

        <RepoList repos={repoData} loading={loading} />
      </main>

    </div>
  );
}
