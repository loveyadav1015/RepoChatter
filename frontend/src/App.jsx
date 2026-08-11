import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import CursorGlow from './components/CursorGlow';
import Home from './pages/Home';
import RepoDashboard from './pages/RepoDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <CursorGlow />
      <Toaster theme="dark" position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repos/:id" element={<RepoDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
