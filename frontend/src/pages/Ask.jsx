import { useState } from 'react';
import { ragApi } from '../services/api';

/**
 * Ask Page — the RAG Q&A interface.
 * User types a natural-language question, the backend retrieves relevant chunks
 * from their notes, generates an answer via Grok, and returns the answer with
 * citations (source note IDs/titles).
 */
export default function Ask() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer(null);
    setCitations([]);
    setError(null);

    try {
      const { data } = await ragApi.ask(question.trim());
      setAnswer(data.answer);
      setCitations(data.citations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get an answer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page ask-page">
      <header className="page-header">
        <h1>Ask Your Notes</h1>
        <p className="subtitle">
          Ask a question and get an answer grounded in your own notes.
        </p>
      </header>

      <form onSubmit={handleAsk} className="ask-form" id="ask-form">
        <div className="form-group">
          <textarea
            id="ask-question"
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. What are the key differences between REST and GraphQL?"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          id="ask-submit-btn"
          disabled={loading}
        >
          {loading ? 'Thinking…' : 'Ask'}
        </button>
      </form>

      {error && <p className="status-msg error">{error}</p>}

      {answer && (
        <section className="answer-section" id="answer-section">
          <h2>Answer</h2>
          <div className="answer-body">{answer}</div>

          {citations.length > 0 && (
            <div className="citations">
              <h3>Sources</h3>
              <ul>
                {citations.map((cite) => (
                  <li key={cite.noteId}>
                    <strong>{cite.title || `Note #${cite.noteId}`}</strong>
                    {cite.chunkPreview && (
                      <p className="chunk-preview">"{cite.chunkPreview}"</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
