import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { repos } from '../services/api';
import { toast } from 'sonner';
import RepoList from '../components/RepoList';

import TitleSection from '../components/landing/TitleSection';
import PhoneAnalysisSection from '../components/landing/PhoneAnalysisSection';
import Navbar from '../components/Navbar';
import CursorGlow from '../components/CursorGlow';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [repoData, setRepoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entranceDone, setEntranceDone] = useState(false);

  const containerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);

  useEffect(() => {
    fetchRepos();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section 1 -> Section 2 transition
      gsap.timeline({
        scrollTrigger: {
          trigger: section1Ref.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
        },
      }).to(section1Ref.current, { opacity: 0, scale: 0.95, ease: 'none' });

      // Section 2 -> Section 3 transition
      gsap.timeline({
        scrollTrigger: {
          trigger: section2Ref.current,
          start: 'top top',
          end: '+=100%',
          scrub: 1,
          pin: true,
        },
      }).to(section2Ref.current, { opacity: 0, scale: 0.95, ease: 'none' });
    }, containerRef);

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

  const handleEntranceComplete = useCallback(() => {
    setEntranceDone(true);
    window.dispatchEvent(new Event('entrance-complete'));
  }, []);

  return (
    <div ref={containerRef} className="landing-bg w-full relative z-10">
      <CursorGlow />
      <div className={`transition-opacity duration-1000 ${entranceDone ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
      </div>
      <div ref={section1Ref}><TitleSection onComplete={handleEntranceComplete} /></div>
      <div ref={section2Ref}><PhoneAnalysisSection /></div>
      
      <main className="repo-list-container px-4 py-16 md:py-24 md:px-8 max-w-5xl mx-auto relative z-40 bg-transparent">
        <RepoList repos={repoData} loading={loading} />
      </main>
    </div>
  );
}
