/**
 * Chunks a note's content into fixed-size segments.
 * 
 * @param {string} content - The full note content.
 * @param {number} chunkSize - The size of each chunk (e.g. 500 chars).
 * @returns {string[]} - Array of text chunks.
 */
export function chunkNoteContent(content, chunkSize = 500) {
  if (!content) return [];
  
  const chunks = [];
  let i = 0;
  
  // Simple fixed-size chunking (no overlap)
  while (i < content.length) {
    chunks.push(content.slice(i, i + chunkSize));
    i += chunkSize;
  }
  
  return chunks;
}
