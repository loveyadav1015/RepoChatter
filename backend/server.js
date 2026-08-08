import app from './src/app.js';
import { startScheduler } from './src/jobs/scheduler.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`[Server] Express app running on http://localhost:${PORT}`);
  startScheduler();
});
