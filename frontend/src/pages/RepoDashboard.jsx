import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { repos, chat } from '../services/api';

export default function RepoDashboard() {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    console.log('[Dashboard] Loading repo id:', id);
    repos.get(id)
      .then((res) => {
        console.log('[Dashboard] Repo data:', res.data);
        setRepo(res.data);
      })
      .catch((err) => {
        console.error('[Dashboard] Failed to load repo:', err);
        setLoadError(err.response?.data?.message || 'Failed to load repository.');
      });
  }, [id]);

  async function handleAsk(e) {
    e.preventDefault();
    setAsking(true);
    try {
      const res = await chat.ask(id, question);
      setQaHistory([...qaHistory, { question, answer: res.data.answer, sources: res.data.sourceChunkTexts }]);
      setQuestion('');
    } catch (err) {
      console.error('[Dashboard] Chat failed:', err);
      setQaHistory([...qaHistory, { question, answer: 'Error: ' + (err.response?.data?.message || err.message) }]);
    } finally {
      setAsking(false);
    }
  }

  if (loadError) return <div style={{ padding: '48px', color: 'red' }}>{loadError}</div>;
  if (!repo) return <div style={{ padding: '48px' }}>Loading...</div>;

  return (
    <div style={{ padding: '48px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{repo.repoName || repo.repo_name}</h1>
      <p>Owner: {repo.owner}</p>
      <p>Commits tracked: {repo.commitCount ?? repo.commit_count ?? 0}</p>

      <hr style={{ margin: '24px 0' }} />

      <h2>Ask a question</h2>
      <form onSubmit={handleAsk}>
        <input
          type="text"
          placeholder="How do I install this?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
          style={{ width: '100%', padding: '12px', marginBottom: '12px' }}
        />
        <button type="submit" disabled={asking} style={{ padding: '12px 24px' }}>
          {asking ? 'Asking...' : 'Ask'}
        </button>
      </form>

      <div style={{ marginTop: '24px' }}>
        {qaHistory.map((qa, i) => (
          <div key={i} style={{ marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
            <p><strong>Q:</strong> {qa.question}</p>
            <p><strong>A:</strong> {qa.answer}</p>
            {qa.sources && (
              <details>
                <summary>Sources</summary>
                {qa.sources.map((s, j) => <p key={j} style={{ fontSize: '0.85em', opacity: 0.7 }}>{s}</p>)}
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
