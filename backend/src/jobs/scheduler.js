import cron from 'node-cron';
import { query } from '../db/connection.js';
import { fetchRecentCommits } from '../services/external/github.adapter.js';

// Default is every hour '0 * * * *', but use every 5 min for dev '*/5 * * * *'
export function startScheduler() {
  console.log('[Cron] Starting scheduler (running every hour)');
  
  cron.schedule('0 * * * *', async () => {
    console.log('[Cron] Job started: Fetching recent commits for all tracked repos');
    
    try {
      const result = await query('SELECT id, owner, repo_name, last_fetched FROM tracked_repos');
      const repos = result.rows;
      
      for (const repo of repos) {
        console.log(`[Cron] Fetching commits for ${repo.owner}/${repo.repo_name}`);
        const commits = await fetchRecentCommits(repo.owner, repo.repo_name, repo.last_fetched);
        
        let addedCount = 0;
        for (const commit of commits) {
          try {
            await query(
              `INSERT INTO commit_logs (repo_id, commit_hash, author_name, author_email, commit_message, committed_at) 
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [repo.id, commit.hash, commit.authorName, commit.authorEmail, commit.message, commit.committedAt]
            );
            addedCount++;
          } catch (err) {
            // 23505 is PostgreSQL unique_violation error code
            if (err.code === '23505') {
              // Silently ignore duplicates
            } else {
              console.error(`[Cron] DB insert error for commit ${commit.hash}:`, err.message);
            }
          }
        }
        
        if (addedCount > 0) {
          await query(
            `UPDATE tracked_repos SET last_fetched = NOW(), commit_count = commit_count + $1 WHERE id = $2`,
            [addedCount, repo.id]
          );
        }
        
        console.log(`[Cron] Added ${addedCount} new commits for ${repo.owner}/${repo.repo_name}`);
      }
    } catch (err) {
      console.error('[Cron] Job failed:', err.message);
    }
  });
}
