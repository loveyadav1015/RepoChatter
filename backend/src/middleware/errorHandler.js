export default function errorHandler(err, req, res, next) {
  console.error('[Error]', err.message || err);
  
  if (err.message === 'Repo not found') {
    return res.status(404).json({ error: err.message });
  }
  
  if (err.message && err.message.includes('GitHub API rate limit')) {
    return res.status(429).json({ error: err.message });
  }

  res.status(500).json({ error: err.message || 'Internal Server Error' });
}
