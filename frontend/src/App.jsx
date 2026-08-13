import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Home from './pages/Home';
import RepoDashboard from './pages/RepoDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster theme="dark" position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/repos/:id" element={<RepoDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
