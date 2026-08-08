import { query } from '../db/connection.js';

export async function retrieveTopChunks(repoId, questionEmbedding, k = 5) {
  const vectorString = `[${questionEmbedding.join(',')}]`;

  // pgvector <=> is cosine distance. 
  // We want the smallest distance (most similar).
  const sql = `
    SELECT id, chunk_index, chunk_text, (embedding <=> $2) AS distance
    FROM repo_chunks
    WHERE repo_id = $1
    ORDER BY distance ASC
    LIMIT $3
  `;

  const result = await query(sql, [repoId, vectorString, k]);
  return result.rows;
}
