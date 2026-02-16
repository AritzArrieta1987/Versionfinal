import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import ArtistPortal from '../components/ArtistPortal';

export function ArtistPortalPage() {
  const { artistId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [artistData, setArtistData] = useState<any>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      setIsLoading(true);
      
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // En producción, aquí se haría la llamada a la API
      // const response = await fetch(`/api/artists/${artistId}`);
      // const data = await response.json();
      // setArtistData(data);
      
      setIsLoading(false);
      
      // Si no hay datos del artista, mostrar mensaje
      if (!artistId) {
        navigate('/');
      }
    };

    fetchArtistData();
  }, [artistId, navigate]);

  const handleLogout = () => {
    // Volver a la página de artistas
    navigate('/');
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a1414 0%, #1a2f2f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          textAlign: 'center',
          color: '#c9a574',
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '12px',
          }}>
            Cargando portal del artista...
          </div>
        </div>
      </div>
    );
  }

  if (!artistData) {
    return null;
  }

  return <ArtistPortal onLogout={handleLogout} artistData={artistData} />;
}