export function chunkText(text, chunkSize = 500) {
  if (!text) return [];

  const chunks = [];
  let currentChunk = '';

  const paragraphs = text.split('\n\n');

  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length <= chunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      
      // If a single paragraph is longer than chunkSize, split it roughly
      if (paragraph.length > chunkSize) {
        let p = paragraph;
        while (p.length > 0) {
          chunks.push(p.substring(0, chunkSize));
          p = p.substring(chunkSize);
        }
        currentChunk = '';
      } else {
        currentChunk = paragraph;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  return chunks;
}
