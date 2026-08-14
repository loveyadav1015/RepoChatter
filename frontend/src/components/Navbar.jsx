import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import MagneticWrapper from './MagneticWrapper';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };

    checkUser();
    // Listen for storage changes if auth happens in another tab
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="w-full bg-transparent px-4 md:px-8 h-16 flex items-center justify-between">
      <MagneticWrapper strength={30}>
        <Link to="/" className="font-serif font-bold text-xl text-foreground">
          RepoChatter
        </Link>
      </MagneticWrapper>
      
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              {user.username}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <MagneticWrapper strength={30}>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
            </MagneticWrapper>
            <MagneticWrapper strength={30}>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </MagneticWrapper>
          </>
        )}
      </div>
    </nav>
  );
}
