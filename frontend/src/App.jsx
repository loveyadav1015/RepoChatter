import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Notes from './pages/Notes';
import NoteEditor from './pages/NoteEditor';
import Ask from './pages/Ask';
import './App.css';

/**
 * Root application component.
 * Sets up client-side routing and the persistent navigation sidebar.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        {/* ── Sidebar Navigation ─────────────────────────────── */}
        <nav className="sidebar" id="sidebar">
          <div className="sidebar-brand">
            <h2>📝 OverEngineered</h2>
          </div>
          <ul className="nav-links">
            <li>
              <NavLink to="/notes" className={({ isActive }) => (isActive ? 'active' : '')}>
                📄 Notes
              </NavLink>
            </li>
            <li>
              <NavLink to="/ask" className={({ isActive }) => (isActive ? 'active' : '')}>
                🤖 Ask
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* ── Main Content ───────────────────────────────────── */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/notes" replace />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/new" element={<NoteEditor />} />
            <Route path="/notes/:id" element={<NoteEditor />} />
            <Route path="/ask" element={<Ask />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
