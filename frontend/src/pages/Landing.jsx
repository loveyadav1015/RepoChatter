import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { repos } from '../services/api';

export default function Landing() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await repos.add(url);
      console.log('[Landing] Add repo response:', response.data);

      // CRITICAL: log the exact shape of the response so we know what field
      // actually holds the new repo's id
      const newId = response.data.id || response.data.repo?.id;
      if (!newId) {
        console.error('[Landing] No id found in response!', response.data);
        setError('Repo was added but no ID was returned. Check backend response shape.');
        return;
      }

      navigate(`/repos/${newId}`);
    } catch (err) {
      console.error('[Landing] Failed to add repo:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to add repository.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '48px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Repo Chatter</h1>
      <p>Paste a GitHub repository URL</p>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://github.com/owner/repo"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '12px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '12px 24px' }}>
          {loading ? 'Adding...' : 'Start Chatting'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
