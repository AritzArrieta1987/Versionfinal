import { useState, useEffect } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router';
import LoginPanel from './components/LoginPanel';
import ArtistPortal from './components/ArtistPortal';
import AdminLayout from './components/AdminLayout';
import { Toaster } from './components/Toaster';
import { HomePage } from './pages/HomePage';
import { ArtistsPage } from './pages/ArtistsPage';
import { CatalogPage } from './pages/CatalogPage';
import { RoyaltiesPage } from './pages/RoyaltiesPage';
import { ContractsPage } from './pages/ContractsPage';
import { UploadPage } from './pages/UploadPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './utils/debug'; // Importar debug tools

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

  // Router para admin con AdminLayout
  const adminRouter = createBrowserRouter([
    {
      path: '/',
      element: <AdminLayout onLogout={handleLogout} />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: 'artists',
          element: <ArtistsPage />
        },
        {
          path: 'catalog',
          element: <CatalogPage />
        },
        {
          path: 'royalties',
          element: <RoyaltiesPage />
        },
        {
          path: 'contracts',
          element: <ContractsPage />
        },
        {
          path: 'upload',
          element: <UploadPage />
        },
        {
          path: '*',
          element: <NotFoundPage />
        }
      ]
    }
  ]);

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
      <RouterProvider router={adminRouter} />
    </>
  );
}