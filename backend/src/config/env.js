import dotenv from 'dotenv';
import { embed } from '../services/external/embeddings.adapter.js';
import { query } from '../db/connection.js';

dotenv.config();

export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'GROQ_API_KEY',
    'PORT'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`[Fatal] Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

export async function verifyEmbeddingDimensionMatch() {
  // Get a sample embedding from the current provider
  const testEmbedding = await embed('dimension check');
  const providerDim = testEmbedding.length;

  // Get the declared column dimension from Postgres
  const result = await query(`
    SELECT atttypmod as dim
    FROM pg_attribute
    WHERE attrelid = 'repo_chunks'::regclass
    AND attname = 'embedding'
  `);
  const columnDim = result.rows[0]?.dim;

  if (columnDim && providerDim !== columnDim) {
    console.error(
      `[STARTUP CHECK FAILED] Embedding provider produces ${providerDim}-dim vectors, ` +
      `but repo_chunks.embedding column expects ${columnDim}-dim. ` +
      `Run the appropriate ALTER TABLE migration and re-ingest all repos before continuing.`
    );
    process.exit(1);
  }

  console.log(`[STARTUP CHECK] Embedding dimension verified: ${providerDim}-dim matches DB column.`);
}
