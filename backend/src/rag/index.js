import { chunkText } from './ingest.js';
import { embedAndStoreChunks } from './embed.js';
import { retrieveTopChunks } from './retrieve.js';
import { generateGroundedAnswer } from './generate.js';
import { embed } from '../services/external/embeddings.adapter.js';
import { fetchReadme } from '../services/external/github.adapter.js';
import { query } from '../db/connection.js';

export async function ingestReadme(repoId, owner, name) {
  try {
    const readmeContent = await fetchReadme(owner, name);
    
    // Save raw readme to db just in case
    await query('UPDATE tracked_repos SET readme_content = $1 WHERE id = $2', [readmeContent, repoId]);
    
    // Clear existing chunks for this repo if re-ingesting
    await query('DELETE FROM repo_chunks WHERE repo_id = $1', [repoId]);

    const chunks = chunkText(readmeContent, 500);
    await embedAndStoreChunks(repoId, chunks);

    await query('UPDATE tracked_repos SET last_embedded = NOW() WHERE id = $1', [repoId]);
    return true;
  } catch (err) {
    console.error('[RAG Ingest] Error:', err.message);
    throw err;
  }
}

export async function queryRAG(repoId, question) {
  try {
    const questionEmbedding = await embed(question);
    
    const topChunks = await retrieveTopChunks(repoId, questionEmbedding, 5);
    
    const answer = await generateGroundedAnswer(question, topChunks);
    
    const sourceChunkIds = topChunks.map(c => c.id);
    const sourceChunkTexts = topChunks.map(c => c.chunk_text);

    // Log to chat_history
    const sql = `
      INSERT INTO chat_history (repo_id, user_question, assistant_answer, source_chunk_ids)
      VALUES ($1, $2, $3, $4)
    `;
    await query(sql, [repoId, question, answer, sourceChunkIds]);

    return { answer, sourceChunkIds, sourceChunkTexts };
  } catch (err) {
    console.error('[RAG Query] Error:', err.message);
    throw err;
  }
}
