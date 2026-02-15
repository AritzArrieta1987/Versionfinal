import { TrendingUp, DollarSign, ArrowUpRight, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface IncomeSectionProps {
  dashboardData: any;
  artists: any[];
}

export function IncomeSection({ dashboardData, artists }: IncomeSectionProps) {
  // Colores para el gráfico de pastel
  const COLORS = ['#c9a574', '#b8935d', '#a68251', '#947045', '#826039'];

  // Datos de ingresos por artista
  const artistIncomeData = artists.map((artist, index) => ({
    name: artist.name,
    value: artist.totalRevenue || 0,
    color: COLORS[index % COLORS.length]
  }));

  // Datos de ingresos por plataforma (mock)
  const platformData = [
    { name: 'Spotify', revenue: dashboardData.totalRevenue * 0.45 },
    { name: 'Apple Music', revenue: dashboardData.totalRevenue * 0.25 },
    { name: 'YouTube Music', revenue: dashboardData.totalRevenue * 0.15 },
    { name: 'Amazon Music', revenue: dashboardData.totalRevenue * 0.10 },
    { name: 'Otros', revenue: dashboardData.totalRevenue * 0.05 }
  ];

  return (
    <div>
      {/* Header Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Total Ingresos */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(201, 165, 116, 0.05) 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(201, 165, 116, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(201, 165, 116, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#c9a574" />
            </div>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Ingresos
            </span>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#c9a574',
            marginBottom: '8px'
          }}>
            €{dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ArrowUpRight size={14} color="#4ade80" />
            <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: '600' }}>
              +15.3%
            </span>
            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
              vs mes anterior
            </span>
          </div>
        </div>

        {/* Promedio por Artista */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(201, 165, 116, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} color="#c9a574" />
            </div>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Promedio / Artista
            </span>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            €{(dashboardData.totalRevenue / Math.max(artists.length, 1)).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {artists.length} artistas activos
          </div>
        </div>

        {/* Total Streams */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(201, 165, 116, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingUp size={24} color="#c9a574" />
            </div>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Streams
            </span>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px'
          }}>
            {dashboardData.totalStreams.toLocaleString('es-ES')}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            Reproducciones totales
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Ingresos por Plataforma */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid rgba(201, 165, 116, 0.2)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            Ingresos por Plataforma
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255, 255, 255, 0.6)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.6)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(42, 63, 63, 0.95)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value: any) => [`€${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, '']}
                  labelStyle={{ color: '#c9a574' }}
                />
                <Bar dataKey="revenue" fill="#c9a574" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución por Artista */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid rgba(201, 165, 116, 0.2)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            Por Artista
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={artistIncomeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: €${(entry.value / 1000).toFixed(1)}k`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {artistIncomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(42, 63, 63, 0.95)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value: any) => [`€${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tabla de Detalles */}
      <div style={{
        background: 'rgba(42, 63, 63, 0.3)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            Detalle de Ingresos por Artista
          </h3>
          <button
            onClick={() => alert('Exportando a Excel...')}
            style={{
              padding: '8px 16px',
              background: 'rgba(201, 165, 116, 0.1)',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '8px',
              color: '#c9a574',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
            }}
          >
            <Download size={14} />
            Exportar
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Artista
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'right',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Streams
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'right',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Ingresos
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'right',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  % BAM
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'right',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Beneficio BAM
                </th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist, index) => {
                const bamPercentage = 30; // Mock - vendría del contrato
                const bamProfit = (artist.totalRevenue || 0) * (bamPercentage / 100);
                
                return (
                  <tr
                    key={artist.id}
                    style={{
                      borderBottom: index < artists.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <td style={{
                      padding: '20px 24px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: artist.photo ? `url(${artist.photo})` : '#c9a574',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#2a3f3f'
                        }}>
                          {!artist.photo && artist.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#ffffff'
                          }}>
                            {artist.name}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.5)'
                          }}>
                            {artist.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}>
                      {(artist.totalStreams || 0).toLocaleString('es-ES')}
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'right',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#c9a574'
                    }}>
                      €{(artist.totalRevenue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'right',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff'
                    }}>
                      {bamPercentage}%
                    </td>
                    <td style={{
                      padding: '20px 24px',
                      textAlign: 'right',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#c9a574'
                    }}>
                      €{bamProfit.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
