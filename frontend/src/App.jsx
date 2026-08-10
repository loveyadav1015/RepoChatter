import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import RepoDashboard from './pages/RepoDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/repos/:id" element={<RepoDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
