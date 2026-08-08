import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// We use Drizzle ORM as the query builder layer. It provides type-safety,
// SQL-like syntax, and works well with pgvector compared to heavy ORMs like Prisma 
// or writing raw SQL queries.
export const db = drizzle(pool);

export default db;
