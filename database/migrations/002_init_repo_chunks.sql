CREATE TABLE repo_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES tracked_repos(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  source_section VARCHAR(255),
  embedding vector(384),
  embedded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT repo_chunks_repo_fk FOREIGN KEY (repo_id) REFERENCES tracked_repos(id)
);

CREATE INDEX idx_repo_chunks_repo_id ON repo_chunks(repo_id);
CREATE INDEX idx_repo_chunks_embedding ON repo_chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
