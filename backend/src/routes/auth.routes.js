import express from 'express';
import { createUser, verifyUser, generateToken } from '../services/auth.service.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const user = await createUser(username, password);
    const token = generateToken(user);

    res.status(201).json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await verifyUser(username, password);
    const token = generateToken(user);

    res.status(200).json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

export default router;
