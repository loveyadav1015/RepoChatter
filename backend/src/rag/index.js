import { chunkNoteContent } from './ingest.js';
import { embedChunks } from './embed.js';
import { retrieveRelevantChunks } from './retrieve.js';
import { generateAnswer } from './generate.js';

/**
 * Orchestrates the ingestion of a newly saved/updated note.
 * 
 * @param {Object} note - The note object.
 */
export async function ingestNote(note) {
  // 1. Chunking
  const chunks = chunkNoteContent(note.content);
  
  // 2. Embedding
  const embeddedChunks = await embedChunks(chunks);
  
  // 3. Database Insertion
  // TODO: Insert into `note_chunks` using Drizzle
  console.log(`Ingested note ${note.id} into ${embeddedChunks.length} chunks.`);
}

/**
 * Orchestrates the full RAG pipeline for a user question.
 * 
 * @param {string} question - The natural language query.
 * @returns {Promise<{answer: string, citations: Array}>}
 */
export async function queryRAG(question) {
  // 1. Retrieve
  const contexts = await retrieveRelevantChunks(question);
  
  // 2. Generate
  const result = await generateAnswer(question, contexts);
  
  return result;
}
