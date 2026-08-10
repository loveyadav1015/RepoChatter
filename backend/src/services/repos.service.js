import { query } from '../db/connection.js';
import { parseRepoUrl } from './external/github.adapter.js';

export async function addRepo(repoUrl) {
  const { owner, name, slug } = parseRepoUrl(repoUrl);

  // Check if it already exists
  const existCheck = await query('SELECT * FROM tracked_repos WHERE repo_url = $1', [repoUrl]);
  if (existCheck.rows.length > 0) {
    return existCheck.rows[0];
  }

  // Insert repo
  const result = await query(
    `INSERT INTO tracked_repos (repo_url, repo_name, owner, repo_slug, last_fetched)
     VALUES ($1, $2, $3, $4, NULL) RETURNING *`,
    [repoUrl, name, owner, slug]
  );

  const repo = result.rows[0];

  return repo;
}

export async function listRepos() {
  const result = await query('SELECT id, repo_name, owner, repo_url, commit_count, last_fetched, created_at FROM tracked_repos ORDER BY created_at DESC');
  return result.rows;
}

export async function getRepoDetails(id) {
  const repoResult = await query('SELECT * FROM tracked_repos WHERE id = $1', [id]);
  if (repoResult.rows.length === 0) throw new Error('Repo not found');
  const repo = repoResult.rows[0];

  const commitsResult = await query(
    'SELECT commit_hash, author_name, commit_message, committed_at FROM commit_logs WHERE repo_id = $1 ORDER BY committed_at DESC LIMIT 10',
    [id]
  );

  return { ...repo, recent_commits: commitsResult.rows };
}

export async function removeRepo(id) {
  // Cascades will handle chunks, commits, and chat_history
  await query('DELETE FROM tracked_repos WHERE id = $1', [id]);
}
