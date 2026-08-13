import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db/connection.js';

const SALT_ROUNDS = 12; // standard secure default for 2025+ hardware

export async function createUser(username, password) {
  const existing = await query('SELECT id FROM users WHERE username = $1', [username]);
  if (existing.rows.length > 0) {
    throw new Error('Username already taken.');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const result = await query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
    [username, passwordHash]
  );

  return result.rows[0]; // never return password_hash
}

export async function verifyUser(username, password) {
  const result = await query('SELECT id, username, password_hash FROM users WHERE username = $1', [username]);
  const user = result.rows[0];

  if (!user) {
    // Deliberately vague — do not reveal whether username or password was wrong,
    // this prevents username enumeration attacks
    throw new Error('Invalid username or password.');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new Error('Invalid username or password.'); // same vague message
  }

  return { id: user.id, username: user.username };
}

export function generateToken(user) {
  return jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET); // throws if invalid/expired
}
