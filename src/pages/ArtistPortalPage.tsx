import { useParams, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import ArtistPortal from '../components/ArtistPortal';

// Mock data - En producción vendría del backend
const MOCK_ARTISTS_DATA: { [key: string]: any } = {
  '1': {
    id: 1,
    name: 'Luna García',
    email: 'luna@bigartist.es',
    photo: 'https://images.unsplash.com/photo-1615748561835-cff146a0b3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzExOTk1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    totalRevenue: 45789.50,
    totalStreams: 2458900,
    tracks: [
      { title: 'Noche de Estrellas', isrc: 'ES-ABC-24-00123' },
      { title: 'Bailando Sola', isrc: 'ES-ABC-24-00124' },
      { title: 'Luna Llena', isrc: 'ES-ABC-23-00089' },
    ],
    monthlyData: [
      { month: 'Ene', revenue: 3200, streams: 185000 },
      { month: 'Feb', revenue: 4100, streams: 235000 },
      { month: 'Mar', revenue: 3800, streams: 210000 },
      { month: 'Abr', revenue: 4500, streams: 265000 },
      { month: 'May', revenue: 5200, streams: 298000 },
      { month: 'Jun', revenue: 4890, streams: 278000 },
    ],
    platformBreakdown: {
      'Spotify': 18450.30,
      'Apple Music': 12780.50,
      'YouTube Music': 8920.40,
      'Deezer': 3840.20,
      'Amazon Music': 1798.10,
    }
  },
  '2': {
    id: 2,
    name: 'Carlos Beats',
    email: 'carlos@bigartist.es',
    photo: 'https://images.unsplash.com/photo-1608357501758-430201af2e56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcmFwcGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMTk5NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    totalRevenue: 78456.25,
    totalStreams: 4289500,
    tracks: [
      { title: 'Flow Urbano', isrc: 'ES-XYZ-23-00456' },
      { title: 'En la Calle', isrc: 'ES-XYZ-23-00457' },
      { title: 'Ritmo Latino', isrc: 'ES-XYZ-23-00458' },
      { title: 'Verano Caliente', isrc: 'ES-XYZ-24-00012' },
      { title: 'Noche y Día', isrc: 'ES-XYZ-24-00013' },
    ],
    monthlyData: [
      { month: 'Ene', revenue: 6200, streams: 340000 },
      { month: 'Feb', revenue: 7100, streams: 389000 },
      { month: 'Mar', revenue: 8300, streams: 456000 },
      { month: 'Abr', revenue: 9500, streams: 521000 },
      { month: 'May', revenue: 11200, streams: 614000 },
      { month: 'Jun', revenue: 10890, streams: 598000 },
    ],
    platformBreakdown: {
      'Spotify': 31280.50,
      'Apple Music': 21340.80,
      'YouTube Music': 15920.40,
      'Deezer': 6840.20,
      'Amazon Music': 3074.35,
    }
  },
  '3': {
    id: 3,
    name: 'DJ Martina',
    email: 'martina@bigartist.es',
    photo: 'https://images.unsplash.com/photo-1764014353079-08ece464a226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHByb2R1Y2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMTk5NTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    totalRevenue: 32145.80,
    totalStreams: 1756200,
    tracks: [
      { title: 'Electronic Dreams', isrc: 'ES-EDM-24-00089' },
      { title: 'Bass Drop', isrc: 'ES-EDM-24-00090' },
      { title: 'Festival Vibes', isrc: 'ES-EDM-24-00091' },
    ],
    monthlyData: [
      { month: 'Ene', revenue: 2800, streams: 152000 },
      { month: 'Feb', revenue: 3200, streams: 175000 },
      { month: 'Mar', revenue: 4100, streams: 223000 },
      { month: 'Abr', revenue: 5500, streams: 301000 },
      { month: 'May', revenue: 6200, streams: 339000 },
      { month: 'Jun', revenue: 5890, streams: 322000 },
    ],
    platformBreakdown: {
      'Spotify': 12850.30,
      'Apple Music': 8920.50,
      'YouTube Music': 6340.20,
      'Deezer': 2540.60,
      'Amazon Music': 1494.20,
    }
  },
  '4': {
    id: 4,
    name: 'Miguel Ángel',
    email: 'miguel@bigartist.es',
    photo: 'https://images.unsplash.com/photo-1671786390055-13842b30e424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTE3NjUwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    totalRevenue: 89234.60,
    totalStreams: 4892300,
    tracks: [
      { title: 'Corazón Roto', isrc: 'ES-POP-23-00234' },
      { title: 'Te Extraño', isrc: 'ES-POP-23-00235' },
      { title: 'Vuelve', isrc: 'ES-POP-23-00236' },
      { title: 'Por Siempre', isrc: 'ES-POP-24-00045' },
      { title: 'Mi Amor', isrc: 'ES-POP-24-00046' },
      { title: 'Contigo', isrc: 'ES-POP-24-00047' },
    ],
    monthlyData: [
      { month: 'Ene', revenue: 7200, streams: 394000 },
      { month: 'Feb', revenue: 8100, streams: 443000 },
      { month: 'Mar', revenue: 9300, streams: 509000 },
      { month: 'Abr', revenue: 11500, streams: 630000 },
      { month: 'May', revenue: 13200, streams: 723000 },
      { month: 'Jun', revenue: 12890, streams: 706000 },
    ],
    platformBreakdown: {
      'Spotify': 35670.30,
      'Apple Music': 24580.50,
      'YouTube Music': 17850.40,
      'Deezer': 7840.20,
      'Amazon Music': 3293.20,
    }
  },
  '5': {
    id: 5,
    name: 'Sara Melodías',
    email: 'sara@bigartist.es',
    totalRevenue: 28567.40,
    totalStreams: 1567800,
    tracks: [
      { title: 'Dulce Canción', isrc: 'ES-IND-24-00078' },
      { title: 'Secretos', isrc: 'ES-IND-24-00079' },
    ],
    monthlyData: [
      { month: 'Ene', revenue: 2400, streams: 131000 },
      { month: 'Feb', revenue: 2900, streams: 159000 },
      { month: 'Mar', revenue: 3500, streams: 192000 },
      { month: 'Abr', revenue: 4200, streams: 230000 },
      { month: 'May', revenue: 5100, streams: 279000 },
      { month: 'Jun', revenue: 4890, streams: 268000 },
    ],
    platformBreakdown: {
      'Spotify': 11426.96,
      'Apple Music': 7998.47,
      'YouTube Music': 5713.48,
      'Deezer': 2284.70,
      'Amazon Music': 1143.79,
    }
  },
  '6': {
    id: 6,
    name: 'Pablo Flow',
    email: 'pablo@bigartist.es',
    totalRevenue: 51890.75,
    totalStreams: 2845600,
    tracks: [
      { title: 'Trap King', isrc: 'ES-TRP-23-00567' },
      { title: 'Modo Avión', isrc: 'ES-TRP-23-00568' },
      { title: 'Sin Parar', isrc: 'ES-TRP-24-00023' },
      { title: 'Fuego', isrc: 'ES-TRP-24-00024' },
    ],
    monthlyData: [
      { month: 'Ene', revenue: 4200, streams: 230000 },
      { month: 'Feb', revenue: 5100, streams: 279000 },
      { month: 'Mar', revenue: 6300, streams: 345000 },
      { month: 'Abr', revenue: 7500, streams: 411000 },
      { month: 'May', revenue: 8900, streams: 487000 },
      { month: 'Jun', revenue: 8490, streams: 465000 },
    ],
    platformBreakdown: {
      'Spotify': 20756.30,
      'Apple Music': 14529.21,
      'YouTube Music': 10378.15,
      'Deezer': 4151.26,
      'Amazon Music': 2075.83,
    }
  },
};

export function ArtistPortalPage() {
  const { artistId } = useParams<{ artistId: string }>();
  const navigate = useNavigate();
  const [artistData, setArtistData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del artista
    // En producción esto haría una llamada a la API: /api/artists/${artistId}
    const loadArtistData = async () => {
      setLoading(true);
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (artistId && MOCK_ARTISTS_DATA[artistId]) {
        setArtistData(MOCK_ARTISTS_DATA[artistId]);
      } else {
        // Artista no encontrado, redirigir
        navigate('/');
      }
      
      setLoading(false);
    };

    loadArtistData();
  }, [artistId, navigate]);

  const handleLogout = () => {
    // Volver a la página de artistas
    navigate('/');
  };

  if (loading) {
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
