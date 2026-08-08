import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { notesApi } from '../services/api';

/**
 * Notes List Page
 * Displays all notes with search/filter, links to editor, and delete capability.
 */
export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await notesApi.getAll();
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      await notesApi.delete(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Client-side search filter
  const filtered = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <div className="page notes-page">
      <header className="page-header">
        <h1>My Notes</h1>
        <Link to="/notes/new" className="btn btn-primary" id="create-note-btn">
          + New Note
        </Link>
      </header>

      <div className="search-bar">
        <input
          id="notes-search"
          type="text"
          placeholder="Search notes by title or tag…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="status-msg">Loading notes…</p>}
      {error && <p className="status-msg error">{error}</p>}

      {!loading && filtered.length === 0 && (
        <p className="status-msg empty">
          No notes yet.{' '}
          <Link to="/notes/new">Create your first note</Link>
        </p>
      )}

      <ul className="notes-list" id="notes-list">
        {filtered.map((note) => (
          <li key={note.id} className="note-card">
            <Link to={`/notes/${note.id}`} className="note-card-link">
              <h3>{note.title || 'Untitled'}</h3>
              <p className="note-preview">
                {note.content?.slice(0, 120)}
                {note.content?.length > 120 ? '…' : ''}
              </p>
              {note.tags?.length > 0 && (
                <div className="tags">
                  {note.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(note.id)}
              aria-label={`Delete ${note.title}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
