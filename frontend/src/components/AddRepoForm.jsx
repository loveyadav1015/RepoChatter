import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { repos } from '../services/api';
import { useLocalGlow } from '../hooks/useLocalGlow';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function AddRepoForm({ compact = false }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { ref, onMouseMove } = useLocalGlow();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const res = await repos.add(url);
      navigate(`/repos/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={compact ? 'flex flex-col gap-3 w-full' : 'hero-form'}
    >
      <Input
        type="url"
        placeholder={compact ? "github.com/owner/repo" : "https://github.com/owner/repo"}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
        required
        className={compact 
          ? "w-full h-10 px-3 text-sm bg-background border-border text-foreground focus:ring-glow" 
          : "flex-1 h-12 px-4 text-base placeholder:text-base md:placeholder:text-lg bg-background border-border text-foreground focus:ring-glow"
        }
      />
      <div 
        ref={ref} 
        onMouseMove={onMouseMove} 
        className="glow-on-hover rounded-md shrink-0 w-full"
      >
        <Button 
          type="submit" 
          disabled={loading}
          className={compact 
            ? "w-full h-10 px-4 text-sm bg-primary text-primary-foreground hover:opacity-90 font-semibold" 
            : "w-full h-12 px-6 text-base bg-primary text-primary-foreground hover:opacity-90 font-semibold"
          }
        >
          {loading ? 'Adding...' : 'Add Repo'}
        </Button>
      </div>
    </form>
  );
}
