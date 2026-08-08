CREATE TABLE commit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES tracked_repos(id) ON DELETE CASCADE,
  commit_hash VARCHAR(255) NOT NULL,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  commit_message TEXT,
  committed_at TIMESTAMP,
  fetched_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT commit_logs_repo_fk FOREIGN KEY (repo_id) REFERENCES tracked_repos(id)
);

CREATE INDEX idx_commit_logs_repo_id ON commit_logs(repo_id);
CREATE INDEX idx_commit_logs_committed_at ON commit_logs(committed_at DESC);
CREATE UNIQUE INDEX idx_commit_logs_unique ON commit_logs(repo_id, commit_hash);
