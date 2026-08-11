import { useState, useEffect } from 'react';
import { useGsapReveal } from '../hooks/useGsapReveal';
import { repos } from '../services/api';
import { toast } from 'sonner';
import AddRepoForm from '../components/AddRepoForm';
import RepoList from '../components/RepoList';

export default function Home() {
  const [repoData, setRepoData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const headerRef = useGsapReveal('entrance');

  useEffect(() => {
    fetchRepos();
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
    <div className="min-h-screen px-4 py-8 md:py-16 md:px-8 max-w-5xl mx-auto space-y-16">
      
      <header ref={headerRef} className="hero-section">
        <h1 className="hero-title">
          Repo Chatter
        </h1>
        <p className="hero-subtitle">
          Ask questions about any GitHub repository and get<br className="hidden md:block" />
          answers grounded in its README.
        </p>
        <AddRepoForm />
      </header>

      <main>
        {/* Removing Tracked Repositories subheader as per picture 2 */}
        
        <RepoList repos={repoData} loading={loading} />
      </main>
      
    </div>
  );
}
