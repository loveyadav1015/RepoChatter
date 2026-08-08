import { embedBatch } from '../services/external/embeddings.adapter.js';
import { query } from '../db/connection.js';

export async function embedAndStoreChunks(repoId, chunks) {
  if (chunks.length === 0) return;

  // 1. Get embeddings for all chunks in a batch
  const embeddings = await embedBatch(chunks);

  // 2. Insert into repo_chunks
  // Building parameterized query manually for batch insert
  const values = [];
  const queryPlaceholders = [];
  let paramCount = 1;

  for (let i = 0; i < chunks.length; i++) {
    const chunkText = chunks[i];
    const embedding = embeddings[i];
    const vectorString = `[${embedding.join(',')}]`; // pgvector expects '[x,y,z]'

    queryPlaceholders.push(`($${paramCount}, $${paramCount + 1}, $${paramCount + 2}, $${paramCount + 3}, NOW())`);
    values.push(repoId, i, chunkText, vectorString);
    paramCount += 4;
  }

  const sql = `
    INSERT INTO repo_chunks (repo_id, chunk_index, chunk_text, embedding, embedded_at)
    VALUES ${queryPlaceholders.join(', ')}
  `;

  await query(sql, values);
}
