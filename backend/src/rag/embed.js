import { embedText } from '../services/external/embeddings.adapter.js';

/**
 * Takes note chunks, generates embeddings using the swappable provider,
 * and prepares them for database insertion.
 * 
 * @param {string[]} chunks - Array of text chunks.
 * @returns {Promise<Array<{text: string, embedding: number[]}>>}
 */
export async function embedChunks(chunks) {
  const result = [];
  
  for (const chunk of chunks) {
    // We isolate the embedding call so the provider can be swapped easily.
    const embedding = await embedText(chunk);
    result.push({ text: chunk, embedding });
  }
  
  return result;
}
