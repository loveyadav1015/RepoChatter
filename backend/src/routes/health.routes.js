import { Router } from 'express';
import { query } from '../db/connection.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

export default router;
