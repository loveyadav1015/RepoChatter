import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { repos } from '../services/api';
import { useLocalGlow } from '../hooks/useLocalGlow';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Link2 } from 'lucide-react';

export default function AddRepoForm({ 
  compact = false, 
  showIcon = false, 
  placeholder, 
  buttonText 
}) {
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
      <div className="relative w-full flex-1">
        {showIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Link2 className="w-4 h-4" />
          </div>
        )}
        <Input
          type="url"
          placeholder={placeholder || (compact ? "github.com/owner/repo" : "https://github.com/owner/repo")}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          required
          className={compact 
            ? `w-full h-10 ${showIcon ? 'pl-9 pr-3' : 'px-3'} text-sm bg-background border-border text-foreground focus:ring-glow` 
            : `w-full h-12 ${showIcon ? 'pl-10 pr-4' : 'px-4'} text-base placeholder:text-base md:placeholder:text-lg bg-background border-border text-foreground focus:ring-glow`
          }
        />
      </div>
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
          {loading ? 'Adding...' : (buttonText || 'Add Repo')}
        </Button>
      </div>
    </form>
  );
}
