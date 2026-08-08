import { generateAnswer } from '../services/external/groq.adapter.js';

export async function generateGroundedAnswer(question, chunks) {
  if (chunks.length === 0) {
    return "I don't have enough context from the README to answer this question.";
  }

  const answer = await generateAnswer(question, chunks);
  return answer;
}
