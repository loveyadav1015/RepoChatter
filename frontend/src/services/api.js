import axios from 'axios';

/**
 * Centralized Axios instance for all backend API calls.
 * Base URL is read from Vite env vars so it can differ per environment.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s — RAG generation can be slow
});

// ── Request interceptor (placeholder for future auth tokens) ────────────
api.interceptors.request.use(
  (config) => {
    // TODO: Attach auth token here when authentication is implemented
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor (centralised error handling) ───────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Global error toast / notification
    console.error('[API Error]', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

// ── Notes API ───────────────────────────────────────────────────────────
export const notesApi = {
  getAll: () => api.get('/notes'),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

// ── RAG / Ask API ───────────────────────────────────────────────────────
export const ragApi = {
  ask: (question) => api.post('/rag/ask', { question }),
};

export default api;
