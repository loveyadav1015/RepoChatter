import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notesApi } from '../services/api';

/**
 * Note Editor Page
 * Create or edit a single note (title, content, tags).
 */
export default function NoteEditor() {
  const { id } = useParams(); // undefined when creating a new note
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState(''); // comma-separated
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);

  // Fetch existing note when editing
  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const { data } = await notesApi.getById(id);
        setTitle(data.title || '');
        setContent(data.content || '');
        setTagsInput((data.tags || []).join(', '));
      } catch (err) {
        setError('Could not load note');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      content,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      if (isNew) {
        await notesApi.create(payload);
      } else {
        await notesApi.update(id, payload);
      }
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="status-msg">Loading…</p>;

  return (
    <div className="page editor-page">
      <header className="page-header">
        <h1>{isNew ? 'New Note' : 'Edit Note'}</h1>
      </header>

      {error && <p className="status-msg error">{error}</p>}

      <form onSubmit={handleSubmit} className="note-form" id="note-form">
        <div className="form-group">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your note a title…"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here…"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="note-tags">Tags (comma-separated)</label>
          <input
            id="note-tags"
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. javascript, react, notes"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            id="save-note-btn"
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save Note'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/notes')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
