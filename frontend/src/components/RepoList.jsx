import { useGsapStagger } from '../hooks/useGsapReveal';
import RepoCard from './RepoCard';
import { Skeleton } from './ui/skeleton';
import MagneticWrapper from './MagneticWrapper';

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
        <MagneticWrapper key={repo.id} strength={20} className="repo-card-item w-full h-full flex">
          <div className="w-full">
            <RepoCard repo={repo} />
          </div>
        </MagneticWrapper>
      ))}
    </div>
  );
}
