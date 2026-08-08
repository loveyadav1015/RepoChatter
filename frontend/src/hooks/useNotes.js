import { useState, useEffect, useCallback } from 'react';
import { notesApi } from '../services/api';

/**
 * Custom hook for notes CRUD operations.
 * Keeps local state in sync with the backend.
 */
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await notesApi.getAll();
      setNotes(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return { notes, loading, error, refetch: fetchNotes };
}

export default useNotes;
