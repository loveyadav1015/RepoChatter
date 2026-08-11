import { Link } from 'react-router-dom';
import { useLocalGlow } from '../hooks/useLocalGlow';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { GitCommit, FolderGit2 } from 'lucide-react';

export default function RepoCard({ repo }) {
  const { ref, onMouseMove } = useLocalGlow();

  return (
    <Link to={`/repos/${repo.id}`} className="block">
      <Card 
        ref={ref}
        onMouseMove={onMouseMove}
        className="glow-on-hover bg-card border-border hover:-translate-y-[2px] transition-transform duration-300 h-full"
      >
        <div className="repo-card h-full justify-between">
          <div>
            <h3 className="repo-card-title text-foreground">
              {repo.repo_name}
            </h3>
            <p className="repo-card-owner">
              {repo.owner}
            </p>
          </div>
          <div className="repo-card-footer">
            <span className="repo-card-badge bg-muted/50">
              {repo.commit_count} commits
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
