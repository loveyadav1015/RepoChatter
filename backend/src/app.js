import express from 'express';
import cors from 'cors';
import { validateEnv } from './config/env.js';
import reposRoutes from './routes/repos.routes.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middleware/errorHandler.js';

// Ensure environment is valid before booting app
validateEnv();

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/repos', reposRoutes);
app.use('/api/health', healthRoutes);

app.use(errorHandler);

export default app;
