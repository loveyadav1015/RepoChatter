-- database/schema.sql

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Notes Table
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Note Chunks Table for Vector Embeddings
CREATE TABLE IF NOT EXISTS note_chunks (
  id SERIAL PRIMARY KEY,
  note_id INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  -- We use 1536 dimensions as it's the standard for OpenAI's text-embedding-3-small
  embedding vector(1536),
  chunk_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for similarity search
-- Adjust index type depending on your dataset size (e.g. HNSW or IVFFlat)
-- CREATE INDEX ON note_chunks USING hnsw (embedding vector_cosine_ops);
