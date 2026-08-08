import express from 'express';
import cors from 'cors';
import notesRoutes from './routes/notes.routes.js';
import ragRoutes from './routes/rag.routes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'OverEngineered API is running' });
});

app.use('/api/notes', notesRoutes);
app.use('/api/rag', ragRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

export default app;
