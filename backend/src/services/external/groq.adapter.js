import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant'; // Groq's fast active model

export async function generateAnswer(question, contextChunks) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.includes('xxxxx')) {
    throw new Error('Valid GROQ_API_KEY is required in .env');
  }

  const chunkText = contextChunks
    .map((chunk, i) => `[Chunk ${i + 1}]\n${chunk.chunk_text}`)
    .join('\n\n');

  const systemPrompt = `You are a helpful assistant that answers questions about a GitHub repository's README.
You MUST only answer based on the provided README content below. If the answer is not in the README, say "I don't know, this isn't covered in the README."
Keep answers concise and accurate.`;

  const userPrompt = `README Content:
${chunkText}

Question: ${question}`;

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    const details = error.response?.data?.error?.message || JSON.stringify(error.response?.data) || error.message;
    console.error('[Groq API Error]:', details);
    if (error.response?.status === 403 || error.response?.status === 401) {
      throw new Error('Groq API Key (GROQ_API_KEY) is invalid or unauthorized (403/401).');
    }
    throw new Error(`Groq API Error: ${details}`);
  }
}
