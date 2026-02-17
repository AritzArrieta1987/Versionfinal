import { LayoutDashboard, TrendingUp, DollarSign, Users, Music, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function HomePage() {
  const [stats, setStats] = useState<any>(null);
  const [royalties, setRoyalties] = useState<any[]>([]);

  useEffect(() => {
    // Cargar datos procesados del CSV
    const dashboardStats = localStorage.getItem('dashboardStats');
    const royaltiesData = localStorage.getItem('royaltiesData');
    
    if (dashboardStats) {
      setStats(JSON.parse(dashboardStats));
    }
    
    if (royaltiesData) {
      setRoyalties(JSON.parse(royaltiesData));
    }
  }, []);

  if (!stats) {
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
            <LayoutDashboard size={32} color="#c9a574" />
            Dashboard
          </h1>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
            Resumen general de BIGARTIST ROYALTIES
          </p>
        </div>

        {/* Empty State */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(201, 165, 116, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <LayoutDashboard size={40} color="#c9a574" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
            No hay datos disponibles
          </h2>
          <p style={{ fontSize: '16px', color: '#AFB3B7', marginBottom: '24px' }}>
            Sube tu primer archivo CSV de The Orchard para ver las estadísticas
          </p>
          <a
            href="/upload"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Subir CSV
          </a>
        </div>
      </div>
    );
  }

  // Stats cards
  const statsCards = [
    {
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: '#22c55e',
      bgColor: 'rgba(34, 197, 94, 0.1)',
      trend: '+12.5%'
    },
    {
      title: 'Total Streams',
      value: stats.totalStreams.toLocaleString('es-ES'),
      icon: TrendingUp,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      trend: '+8.3%'
    },
    {
      title: 'Artistas Activos',
      value: stats.totalArtists,
      icon: Users,
      color: '#c9a574',
      bgColor: 'rgba(201, 165, 116, 0.1)',
      trend: '+2'
    },
    {
      title: 'Canciones',
      value: stats.totalTracks,
      icon: Music,
      color: '#a855f7',
      bgColor: 'rgba(168, 85, 247, 0.1)',
      trend: '+15'
    }
  ];

  // Colores para gráficos
  const COLORS = ['#1DB954', '#FA2D48', '#FF0000', '#c9a574', '#3b82f6', '#a855f7', '#22c55e', '#f59e0b'];

  // Top 5 plataformas
  const topPlatforms = stats.platforms.slice(0, 5);

  // Top 5 territorios
  const topTerritories = stats.territories.slice(0, 5);

  // Datos para gráfico de períodos (evolución temporal)
  const periodsData = stats.periods.map((p: any) => ({
    period: p.period,
    revenue: p.revenue
  }));

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
          <LayoutDashboard size={32} color="#c9a574" />
          Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Resumen general de BIGARTIST ROYALTIES
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {statsCards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <p style={{ fontSize: '13px', color: '#AFB3B7', marginBottom: '8px' }}>
                  {card.title}
                </p>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                  {card.value}
                </h3>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: card.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <card.icon size={24} color={card.color} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e' }}>
                {card.trend}
              </span>
              <span style={{ fontSize: '12px', color: '#AFB3B7' }}>
                vs. mes anterior
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {/* Gráfico de Plataformas */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
            Ingresos por Plataforma
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={topPlatforms}
                dataKey="revenue"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.name}: $${entry.revenue.toFixed(2)}`}
              >
                {topPlatforms.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#2a3f3f',
                  border: '1px solid #c9a574',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Territorios */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
            Top 5 Territorios
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topTerritories}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
              <XAxis dataKey="name" stroke="#AFB3B7" />
              <YAxis stroke="#AFB3B7" />
              <Tooltip
                contentStyle={{
                  background: '#2a3f3f',
                  border: '1px solid #c9a574',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Bar dataKey="revenue" fill="#c9a574" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evolución Temporal */}
      {periodsData.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Calendar size={24} color="#c9a574" />
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Evolución de Ingresos por Período
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={periodsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201, 165, 116, 0.1)" />
              <XAxis dataKey="period" stroke="#AFB3B7" />
              <YAxis stroke="#AFB3B7" />
              <Tooltip
                contentStyle={{
                  background: '#2a3f3f',
                  border: '1px solid #c9a574',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#c9a574" 
                strokeWidth={2}
                dot={{ fill: '#c9a574', r: 5 }}
                activeDot={{ r: 7 }}
                name="Ingresos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Artistas */}
      {stats.topArtists && stats.topArtists.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
            Top 10 Artistas por Ingresos
          </h3>
          <div style={{ overflowX: 'auto' }}>
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
                    Artista
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
                    Canciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.topArtists.map((artist: any, index: number) => (
                  <tr key={index}>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                      fontSize: '14px',
                      color: '#ffffff'
                    }}>
                      {artist.name}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                      fontSize: '14px',
                      color: '#22c55e',
                      fontWeight: '600',
                      textAlign: 'right'
                    }}>
                      ${artist.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                      fontSize: '14px',
                      color: '#AFB3B7',
                      textAlign: 'right'
                    }}>
                      {artist.totalStreams.toLocaleString('es-ES')}
                    </td>
                    <td style={{
                      padding: '12px',
                      borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                      fontSize: '14px',
                      color: '#AFB3B7',
                      textAlign: 'right'
                    }}>
                      {artist.tracks.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
