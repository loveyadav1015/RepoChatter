import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

// Basic connection test
pool.query('SELECT 1', (err) => {
  if (err) {
    console.error('[DB] Connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('[DB] Connected to PostgreSQL');
  }
});

export default pool;
