import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import LoginPanel from './components/LoginPanel';
import ArtistPortal from './components/ArtistPortal';
import { Toaster } from './components/Toaster';
import { router } from './routes';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'artist' | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserType(user.type);
        setIsLoggedIn(true);
      } catch (e) {
        // Si hay error parseando, limpiar localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserType(user.type);
        setIsLoggedIn(true);
      } catch (e) {
        console.error('Error parsing user data');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserType(null);
  };

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLoginSuccess} />;
  }

  // Si es artista, mostrar el portal de artista
  if (userType === 'artist') {
    return <ArtistPortal onLogout={handleLogout} />;
  }

  // Si es admin, mostrar el panel de administración
  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}