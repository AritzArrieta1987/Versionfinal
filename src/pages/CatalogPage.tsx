import { Music, Search, Disc, Play } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [filterArtist, setFilterArtist] = useState('all');
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    loadTracksFromCSV();
  }, []);

  const loadTracksFromCSV = () => {
    // Cargar datos del CSV procesado
    const uploadedCSVs = JSON.parse(localStorage.getItem('uploadedCSVs') || '[]');
    
    if (uploadedCSVs.length > 0 && uploadedCSVs[0].processedData) {
      const processedData = uploadedCSVs[0].processedData;
      const csvArtists = processedData.artists || [];
      
      // Extraer todas las canciones de todos los artistas
      const allTracks = [];
      const artistNames = new Set();
      
      csvArtists.forEach(artist => {
        artistNames.add(artist.name);
        
        artist.tracks.forEach(track => {
          allTracks.push({
            id: track.isrc || `${artist.name}-${track.name}`,
            name: track.name,
            artistName: artist.name,
            release: track.release,
            isrc: track.isrc,
            revenue: track.revenue,
            streams: track.streams,
            platforms: track.platforms
          });
        });
      });
      
      setTracks(allTracks);
      setArtists(['all', ...Array.from(artistNames)]);
    }
  };

  // Filtrar canciones
  const filteredTracks = tracks.filter(track => {
    const matchesSearch = 
      track.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.release.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.isrc.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesArtist = filterArtist === 'all' || track.artistName === filterArtist;
    
    return matchesSearch && matchesArtist;
  });

  return (
    <div>
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
          <Music size={32} color="#c9a574" />
          Catálogo Musical
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Gestiona todas las canciones y álbumes de tus artistas
        </p>
      </div>

      {/* Filtros y búsqueda */}
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
              placeholder="Buscar canciones, artistas, álbumes, ISRC..."
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

        {/* Filtro por artista */}
        <select
          value={filterArtist}
          onChange={(e) => setFilterArtist(e.target.value)}
          style={{
            padding: '14px 16px',
            background: 'rgba(42, 63, 63, 0.4)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '200px'
          }}
        >
          <option value="all">Todos los artistas</option>
          {artists.filter(a => a !== 'all').map(artist => (
            <option key={artist} value={artist}>{artist}</option>
          ))}
        </select>
      </div>

      {/* Estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>Total Canciones</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>{tracks.length}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>Total Artistas</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>{artists.length - 1}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>Total Streams</p>
          <p style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
            {tracks.reduce((sum, t) => sum + t.streams, 0).toLocaleString('es-ES')}
          </p>
        </div>
      </div>

      {/* Lista de canciones */}
      {filteredTracks.length > 0 ? (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'left'
                }}>
                  Canción
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'left'
                }}>
                  Artista
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'left'
                }}>
                  Álbum/Release
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'left'
                }}>
                  ISRC
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'right'
                }}>
                  Streams
                </th>
                <th style={{
                  padding: '12px',
                  background: 'rgba(201, 165, 116, 0.1)',
                  borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textAlign: 'right'
                }}>
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTracks.map((track, index) => (
                <tr key={track.id || index}>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#ffffff'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Play size={16} color="#c9a574" />
                      {track.name}
                    </div>
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#AFB3B7'
                  }}>
                    {track.artistName}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#AFB3B7'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Disc size={14} color="#c9a574" />
                      {track.release}
                    </div>
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '12px',
                    color: '#c9a574',
                    fontFamily: 'monospace'
                  }}>
                    {track.isrc || 'N/A'}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#AFB3B7',
                    textAlign: 'right'
                  }}>
                    {track.streams.toLocaleString('es-ES')}
                  </td>
                  <td style={{
                    padding: '12px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                    fontSize: '14px',
                    color: '#22c55e',
                    fontWeight: '600',
                    textAlign: 'right'
                  }}>
                    ${track.revenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
        }}>
          <Music size={64} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
            No se encontraron canciones
          </h2>
          <p style={{ fontSize: '16px', color: '#AFB3B7' }}>
            {tracks.length === 0 
              ? 'Sube un archivo CSV para ver el catálogo musical' 
              : 'Intenta con otros términos de búsqueda'}
          </p>
        </div>
      )}
    </div>
  );
}
