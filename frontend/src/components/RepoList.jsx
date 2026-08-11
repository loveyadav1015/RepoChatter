import { useGsapStagger } from '../hooks/useGsapReveal';
import RepoCard from './RepoCard';
import { Skeleton } from './ui/skeleton';

export default function RepoList({ repos, loading }) {
  useGsapStagger('.repo-card-item');

  if (loading) {
    return (
      <div className="repo-grid">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-[120px] rounded-xl bg-card" />
        ))}
      </div>
    );
  }

  if (!repos?.length) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No repositories tracked yet. Add one above to get started.
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {repos.map((repo) => (
        <div key={repo.id} className="repo-card-item">
          <RepoCard repo={repo} />
        </div>
      ))}
    </div>
  );
}
