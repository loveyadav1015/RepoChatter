CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE tracked_repos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_url VARCHAR(255) UNIQUE NOT NULL,
  repo_name VARCHAR(255) NOT NULL,
  owner VARCHAR(255) NOT NULL,
  repo_slug VARCHAR(255) NOT NULL,
  readme_content TEXT,
  last_fetched TIMESTAMP,
  last_embedded TIMESTAMP,
  commit_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tracked_repos_repo_url ON tracked_repos(repo_url);
