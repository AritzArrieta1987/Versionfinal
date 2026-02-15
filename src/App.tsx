import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router';
import LoginPanel from './components/LoginPanel';
import { Toaster } from './components/Toaster';
import { router } from './routes';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginPanel onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}
