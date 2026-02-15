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
import { FinancesPage } from './pages/FinancesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import './utils/debug'; // Importar debug tools

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'artista' | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserType(user.type);
        setUserData(user);
        setIsLoggedIn(true);
        console.log('🔐 Usuario restaurado:', user.type, user.email);
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
        console.log('👤 Usuario logueado:', user.type, user.email);
        setUserType(user.type);
        setUserData(user);
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
    setUserData(null);
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
          path: 'finances',
          element: <FinancesPage />
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
  if (userType === 'artista') {
    console.log('✅ Redirigiendo a Portal de Artista');
    return (
      <>
        <Toaster />
        <ArtistPortal 
          onLogout={handleLogout}
          artistData={{
            id: userData?.id || 0,
            name: userData?.name || 'Artista',
            email: userData?.email || '',
            totalRevenue: 0,
            totalStreams: 0,
            tracks: [],
            monthlyData: [],
            platformBreakdown: {}
          }}
        />
      </>
    );
  }

  // Si es admin, mostrar el panel de administración
  console.log('✅ Redirigiendo a Panel Admin');
  return (
    <>
      <Toaster />
      <RouterProvider router={adminRouter} />
    </>
  );
}