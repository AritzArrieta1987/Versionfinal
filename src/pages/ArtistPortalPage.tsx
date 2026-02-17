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
      
      // Cargar datos del artista desde localStorage (datos del CSV)
      const artists = JSON.parse(localStorage.getItem('artists') || '[]');
      const royaltiesData = JSON.parse(localStorage.getItem('royaltiesData') || '[]');
      
      // Buscar el artista por ID o nombre
      const artist = artists.find(a => a.id.toString() === artistId || a.name === artistId);
      
      if (artist && artist.csvData) {
        // Encontrar datos de royalties del artista
        const artistRoyalties = royaltiesData.find(r => r.artistName === artist.name);
        
        // Preparar monthlyData desde los períodos del CSV
        const monthlyData = artist.csvData.periods.map(period => ({
          month: period.period,
          revenue: period.revenue,
          streams: 0 // Se puede calcular sumando streams de todas las canciones en ese período
        }));
        
        // Preparar platformBreakdown
        const platformBreakdown = {};
        artist.csvData.platforms.forEach(platform => {
          platformBreakdown[platform.name] = platform.revenue;
        });
        
        // Construir datos del artista para el portal
        setArtistData({
          id: artist.id,
          name: artist.name,
          email: artist.email,
          photo: artist.photo || '',
          totalRevenue: artist.totalRevenue,
          totalStreams: artist.totalStreams,
          tracks: artist.csvData.tracks,
          monthlyData: monthlyData,
          platformBreakdown: platformBreakdown,
          royaltyPercentage: artist.contractPercentage || artistRoyalties?.royaltyPercentage || 70, // Cambiado a 70%
          artistRoyalty: artist.totalRevenue * ((artist.contractPercentage || artistRoyalties?.royaltyPercentage || 70) / 100),
          labelShare: artist.totalRevenue * ((100 - (artist.contractPercentage || artistRoyalties?.royaltyPercentage || 70)) / 100),
          contractType: artist.contractType || '360',
          territories: artist.csvData.territories
        });
      } else {
        // Si no hay datos del CSV, cargar desde el backend (si existe)
        // En producción, aquí se haría la llamada a la API
        // const response = await fetch(`/api/artists/${artistId}`);
        // const data = await response.json();
        // setArtistData(data);
        
        // Si no hay datos en absoluto, mostrar mensaje o volver a la página principal
        if (!artist) {
          console.log('No se encontró el artista:', artistId);
          // navigate('/');
        }
      }
      
      setIsLoading(false);
    };

    if (artistId) {
      fetchArtistData();
    } else {
      navigate('/');
    }
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