import dotenv from 'dotenv';
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
