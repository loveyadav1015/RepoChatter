let extractorInstance = null;

async function getExtractor() {
  if (!extractorInstance) {
    console.log('[Embeddings] Loading local model Xenova/all-MiniLM-L6-v2 (384 dims)...');
    const mod = await import('@xenova/transformers');
    const pipeline = mod.pipeline || mod.default?.pipeline;
    if (!pipeline) {
      throw new Error('Could not resolve pipeline function from @xenova/transformers');
    }
    extractorInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('[Embeddings] Local model loaded successfully.');
  }
  return extractorInstance;
}

export async function embed(text) {
  try {
    const extractor = await getExtractor();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data); // Array of 384 floats
  } catch (error) {
    console.error('[Embeddings Error]:', error.message);
    throw error;
  }
}

export async function embedBatch(texts) {
  try {
    const extractor = await getExtractor();
    const results = [];
    for (const text of texts) {
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      results.push(Array.from(output.data));
    }
    return results; // Array of arrays, each 384 floats
  } catch (error) {
    console.error('[Batch Embeddings Error]:', error.message);
    throw error;
  }
}
