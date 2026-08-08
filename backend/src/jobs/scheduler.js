import cron from 'node-cron';

/**
 * Sets up a single background job to re-embed notes that have been updated 
 * but whose chunks are stale.
 * 
 * This uses node-cron directly. No external job queue (like BullMQ) is used
 * to keep the architecture simple.
 */
export function setupCronJobs() {
  // Run every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    console.log('[Cron] Running stale notes re-embedding job...');
    try {
      // 1. Find stale notes (where note.updated_at > MAX(chunk.created_at))
      // TODO: Drizzle query to fetch stale notes
      
      // 2. Re-ingest them
      // for (const note of staleNotes) {
      //   await ingestNote(note);
      // }
      
      console.log('[Cron] Job completed.');
    } catch (error) {
      console.error('[Cron] Job failed:', error.message);
    }
  });
  
  console.log('Cron jobs configured.');
}
