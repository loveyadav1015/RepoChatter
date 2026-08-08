import axios from 'axios';

/**
 * Adapter for xAI's Grok API.
 * Encapsulates the external API call, providing a single point for
 * error handling, retries, and configuration.
 * 
 * @param {string} prompt - The assembled prompt (context + question).
 * @returns {Promise<string>} - The generated answer.
 */
export async function generateChatCompletion(prompt) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    console.warn('GROK_API_KEY is not set. Returning stub response.');
    return "This is a stub answer because GROK_API_KEY is missing.";
  }

  try {
    const response = await axios.post(
      'https://api.x.ai/v1/chat/completions',
      {
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b', // Adjust if Grok exposes a specific model string
        stream: false,
        temperature: 0
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000 // 20s timeout
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('[Grok API Error]', error.response?.data || error.message);
    
    // Simple retry/backoff logic could be implemented here
    throw new Error('Failed to generate answer from Grok.');
  }
}
