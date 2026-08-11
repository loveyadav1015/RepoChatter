import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { repos } from '../services/api';
import { toast } from 'sonner';
import { useGsapReveal } from '../hooks/useGsapReveal';
import ChatWindow from '../components/ChatWindow';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Trash2, FolderGit2, Clock } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';

export default function RepoDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const pageRef = useGsapReveal('entrance');
  const headerRef = useGsapReveal('entrance');
  const chatRef = useGsapReveal('entrance');

  useEffect(() => {
    fetchRepo();
  }, [id]);

  const fetchRepo = async () => {
    try {
      const res = await repos.get(id);
      setRepo(res.data);
    } catch (err) {
      setError('Repository not found or failed to load.');
      toast.error('Failed to load repository');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    
    try {
      await repos.delete(id);
      toast.success('Repository removed');
      navigate('/');
    } catch (err) {
      toast.error('Failed to remove repository');
    }
  };

  return (
    <div 
      ref={pageRef} 
      className={`min-h-screen ${error || !repo && !loading ? 'flex flex-col items-center justify-center space-y-4' : 'px-4 py-8 md:py-16 md:px-8 max-w-4xl mx-auto space-y-8'}`}
    >
      {loading ? (
        <>
          <Skeleton className="h-8 w-32 bg-card" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 bg-card" />
            <Skeleton className="h-6 w-1/2 bg-card" />
          </div>
          <Skeleton className="h-[600px] w-full bg-card rounded-xl" />
        </>
      ) : error || !repo ? (
        <>
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={() => navigate('/')}>Return Home</Button>
        </>
      ) : (
        <>
          <div ref={headerRef} className="space-y-6">
        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-foreground text-muted-foreground" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Repos
        </Button>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2">
              {repo.repo_name}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4" /> {repo.owner}
              </span>
              <span>•</span>
              <span>{repo.commit_count} commits tracked</span>
            </div>
          </div>
          
          <Button variant="destructive" onClick={handleDelete} className="shrink-0 self-start">
            <Trash2 className="w-4 h-4 mr-2" /> {confirmDelete ? 'Sure?' : 'Remove'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2" ref={chatRef}>
          <ChatWindow repoId={repo.id} />
        </div>
        
        <div className="bg-card border border-border rounded-xl flex flex-col h-[600px]">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-sans font-semibold tracking-tight">Commit History</h3>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4">
              {repo.recent_commits && repo.recent_commits.length > 0 ? (
                <div className="space-y-4">
                  {repo.recent_commits.map((commit, i) => (
                    <div key={commit.commit_hash} className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">{commit.author_name}</span>
                        <span className="text-xs text-muted-foreground font-mono shrink-0">
                          {commit.commit_hash.substring(0, 7)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {commit.commit_message}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(commit.committed_at).toLocaleDateString()}
                      </div>
                      {i < repo.recent_commits.length - 1 && <Separator className="my-3" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground text-center py-10">
                  No recent commits found.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        </div>
        </>
      )}
    </div>
  );
}
