import { generateChatCompletion } from '../services/external/grok.adapter.js';

/**
 * Stuffs retrieved chunks into a prompt and calls Grok API to generate an answer.
 * 
 * @param {string} question - The user's query.
 * @param {Array} contexts - The retrieved note chunks.
 * @returns {Promise<{answer: string, citations: Array}>}
 */
export async function generateAnswer(question, contexts) {
  const contextText = contexts.map((c, i) => `[Source ${i + 1} (Note ID: ${c.note_id})]: ${c.chunk_text}`).join('\n\n');
  
  const prompt = `You are an intelligent notes assistant. Answer the user's question based strictly on the provided context.

Context:
${contextText}

Question: ${question}

Answer:`;

  const answer = await generateChatCompletion(prompt);
  
  const citations = contexts.map(c => ({
    noteId: c.note_id,
    title: `Note #${c.note_id}`, // In reality, fetch title from DB
    chunkPreview: c.chunk_text.slice(0, 50) + '...'
  }));
  
  return { answer, citations };
}
