import axios from 'axios';

/**
 * Adapter for generating embeddings.
 * Separated from the Grok adapter because Grok does not currently expose an embeddings API.
 * This function can easily swap underlying providers (OpenAI, Voyage, local models)
 * without affecting the rest of the application.
 * 
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} - The embedding vector.
 */
export async function embedText(text) {
  const provider = process.env.EMBEDDING_PROVIDER || 'openai';
  const apiKey = process.env.EMBEDDING_API_KEY;

  if (!apiKey) {
    console.warn('EMBEDDING_API_KEY is not set. Returning dummy vector.');
    return new Array(1536).fill(0.01);
  }

  try {
    if (provider === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          input: text,
          model: 'text-embedding-3-small'
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.data[0].embedding;
    }
    
    throw new Error(`Unsupported embedding provider: ${provider}`);
  } catch (error) {
    console.error('[Embedding API Error]', error.response?.data || error.message);
    throw new Error('Failed to generate embedding.');
  }
}
