-- database/schema.sql

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

CREATE TABLE repo_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES tracked_repos(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  source_section VARCHAR(255),
  embedding vector(1536),
  embedded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_repo_chunks_repo_id ON repo_chunks(repo_id);
CREATE INDEX idx_repo_chunks_embedding ON repo_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE TABLE commit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES tracked_repos(id) ON DELETE CASCADE,
  commit_hash VARCHAR(255) NOT NULL,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  commit_message TEXT,
  committed_at TIMESTAMP,
  fetched_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_commit_logs_repo_id ON commit_logs(repo_id);
CREATE INDEX idx_commit_logs_committed_at ON commit_logs(committed_at DESC);
CREATE UNIQUE INDEX idx_commit_logs_unique ON commit_logs(repo_id, commit_hash);

CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES tracked_repos(id) ON DELETE CASCADE,
  user_question TEXT NOT NULL,
  assistant_answer TEXT,
  source_chunk_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_chat_history_repo_id ON chat_history(repo_id);
