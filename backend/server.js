import app from './src/app.js';
import { startScheduler } from './src/jobs/scheduler.js';
import { verifyEmbeddingDimensionMatch } from './src/config/env.js';

const PORT = process.env.PORT || 4000;

async function start() {
  await verifyEmbeddingDimensionMatch();
  app.listen(PORT, () => {
    console.log(`[Server] Express app running on http://localhost:${PORT}`);
    startScheduler();
  });
}

start();
