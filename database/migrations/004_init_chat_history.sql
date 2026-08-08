CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id UUID NOT NULL REFERENCES tracked_repos(id) ON DELETE CASCADE,
  user_question TEXT NOT NULL,
  assistant_answer TEXT,
  source_chunk_ids UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT chat_history_repo_fk FOREIGN KEY (repo_id) REFERENCES tracked_repos(id)
);

CREATE INDEX idx_chat_history_repo_id ON chat_history(repo_id);
