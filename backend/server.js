import dotenv from 'dotenv';
import app from './src/app.js';
import { setupCronJobs } from './src/jobs/scheduler.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    // Start Cron Jobs
    setupCronJobs();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
