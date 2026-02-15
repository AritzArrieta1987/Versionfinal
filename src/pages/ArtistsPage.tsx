import { Users, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { ArtistCard } from '../components/admin/ArtistCard';

// Mock data - En producción esto vendría de la API
const MOCK_ARTISTS = [
  {
    id: 1,
    name: 'Luna García',
    email: 'luna@bigartist.es',
    phone: '+34 612 345 678',
    photo: 'https://images.unsplash.com/photo-1615748561835-cff146a0b3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzExOTk1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Contrato 360°',
    joinDate: '2024-01-15',
    totalEarnings: 45789.50,
  },
  {
    id: 2,
    name: 'Carlos Beats',
    email: 'carlos@bigartist.es',
    phone: '+34 623 456 789',
    photo: 'https://images.unsplash.com/photo-1608357501758-430201af2e56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcmFwcGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMTk5NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Distribución Digital',
    joinDate: '2023-08-22',
    totalEarnings: 78456.25,
  },
  {
    id: 3,
    name: 'DJ Martina',
    email: 'martina@bigartist.es',
    phone: '+34 634 567 890',
    photo: 'https://images.unsplash.com/photo-1764014353079-08ece464a226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHByb2R1Y2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMTk5NTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Producción Musical',
    joinDate: '2024-03-10',
    totalEarnings: 32145.80,
  },
  {
    id: 4,
    name: 'Miguel Ángel',
    email: 'miguel@bigartist.es',
    phone: '+34 645 678 901',
    photo: 'https://images.unsplash.com/photo-1671786390055-13842b30e424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTE3NjUwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Contrato 360°',
    joinDate: '2023-11-05',
    totalEarnings: 89234.60,
  },
  {
    id: 5,
    name: 'Sara Melodías',
    email: 'sara@bigartist.es',
    phone: '+34 656 789 012',
    contractType: 'Distribución Digital',
    joinDate: '2024-02-18',
    totalEarnings: 28567.40,
  },
  {
    id: 6,
    name: 'Pablo Flow',
    email: 'pablo@bigartist.es',
    phone: '+34 667 890 123',
    contractType: 'Producción Musical',
    joinDate: '2023-12-01',
    totalEarnings: 51890.75,
  },
];

export function ArtistsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [artists] = useState(MOCK_ARTISTS);

  // Filtrar artistas por búsqueda
  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: '#ffffff',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Users size={32} color="#c9a574" />
          Gestión de Artistas
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Administra la información y contratos de tus artistas
        </p>
      </div>

      {/* Barra de acciones */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap',
      }}>
        {/* Búsqueda */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={{
            position: 'relative',
            background: 'rgba(42, 63, 63, 0.4)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <Search
              size={20}
              color="#c9a574"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              placeholder="Buscar artistas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Botón agregar artista */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
          }}
        >
          <Plus size={20} />
          Agregar Artista
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '8px' }}>
            Total Artistas
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#c9a574' }}>
            {artists.length}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '8px' }}>
            Ganancias Totales
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#c9a574' }}>
            €{artists.reduce((sum, a) => sum + (a.totalEarnings || 0), 0).toLocaleString('es-ES')}
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '12px',
          padding: '20px',
        }}>
          <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '8px' }}>
            Nuevos Este Mes
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#c9a574' }}>
            2
          </div>
        </div>
      </div>

      {/* Grid de tarjetas de artistas */}
      {filteredArtists.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {filteredArtists.map(artist => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={() => console.log('Ver detalles de', artist.name)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <Search size={48} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            No se encontraron artistas
          </h3>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
            Intenta con otros términos de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}