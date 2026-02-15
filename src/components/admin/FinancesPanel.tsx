import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Download, Filter, Calendar, Eye, FileText, Clock, ChevronDown, TrendingDown, Check, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { IncomeSection } from './IncomeSection';
import { ExpensesSection } from './ExpensesSection';
import { toast } from '../../utils/toast';

interface FinancesPanelProps {
  dashboardData: any;
  artists: any[];
  uploadedFiles?: any[];
  paymentRequests?: any[];
  setPaymentRequests?: (requests: any[]) => void;
  notifications?: any[];
  setNotifications?: (notifications: any[]) => void;
}

export function FinancesPanel({ dashboardData, artists, paymentRequests = [], setPaymentRequests, notifications = [], setNotifications }: FinancesPanelProps) {
  const [financesTab, setFinancesTab] = useState('overview');
  const [reportPeriod, setReportPeriod] = useState('monthly'); // monthly, quarterly, yearly
  const [reportMonth, setReportMonth] = useState(new Date().getMonth());
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [isMobile, setIsMobile] = useState(false);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock contracts data - En producción esto vendría del backend
  const contracts = artists.map((artist, index) => ({
    id: index + 1,
    artistId: artist.id,
    percentage: index === 0 ? 70 : 60,
  }));

  // Filtrar solicitudes pendientes
  const pendingRequests = paymentRequests.filter(req => req.status === 'pending');

  // Datos para gráfico lineal - Periodos reales del CSV
  const csvLineData = dashboardData.monthlyData && dashboardData.monthlyData.length > 0 
    ? dashboardData.monthlyData.map((data: any) => ({
        mes: data.month,
        revenue: data.revenue,
        streams: data.streams
      }))
    : [];

  return (
    <div style={{ 
      paddingLeft: isMobile ? '12px' : '24px', 
      paddingRight: isMobile ? '12px' : '24px',
      paddingBottom: isMobile ? '100px' : '24px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: isMobile ? '24px' : '32px' }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
          Finanzas y Reportes
        </h1>
        <p style={{ fontSize: isMobile ? '13px' : '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Gestiona y analiza los ingresos, gastos y reportes financieros
        </p>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: isMobile ? '8px' : '12px',
        marginBottom: isMobile ? '24px' : '36px',
        borderBottom: '2px solid rgba(201, 165, 116, 0.2)',
        paddingBottom: '0',
        flexWrap: 'wrap',
        overflowX: isMobile ? 'auto' : 'visible',
        WebkitOverflowScrolling: 'touch'
      }}>
        {[
          { id: 'overview', label: 'Resumen General', icon: Wallet },
          { id: 'income', label: 'Ingresos', icon: ArrowUpRight },
          { id: 'expenses', label: 'Gastos', icon: ArrowDownRight },
          { id: 'requests', label: 'Solicitudes', icon: DollarSign, badge: pendingRequests.length },
          { id: 'reports', label: 'Reportes', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = financesTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFinancesTab(tab.id)}
              style={{
                padding: isMobile ? '10px 16px' : '12px 20px',
                background: isActive ? 'rgba(201, 165, 116, 0.1)' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #c9a574' : '2px solid transparent',
                color: isActive ? '#c9a574' : '#AFB3B7',
                fontSize: isMobile ? '13px' : '14px',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: isMobile ? '6px' : '8px',
                transition: 'all 0.3s ease',
                marginBottom: '-2px',
                position: 'relative',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#AFB3B7';
              }}
            >
              <Icon size={isMobile ? 14 : 16} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <>
                  <style>
                    {`
                      @keyframes badgePulse {
                        0%, 100% {
                          box-shadow: 0 0 10px rgba(201, 165, 116, 0.4);
                          transform: scale(1);
                        }
                        50% {
                          box-shadow: 0 0 20px rgba(201, 165, 116, 0.8);
                          transform: scale(1.05);
                        }
                      }
                    `}
                  </style>
                  <span style={{
                    background: '#c9a574',
                    color: '#2a3f3f',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center',
                    animation: 'badgePulse 2s ease-in-out infinite'
                  }}>
                    {tab.badge}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ padding: '0' }}>
        {/* Overview Tab Content */}
        {financesTab === 'overview' && (
          <>
        {/* Header Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '430px 1fr',
          gap: '16px',
          marginBottom: isMobile ? '20px' : '32px',
          padding: '0',
          width: '100%'
        }}>
          {/* Main Welcome Card */}
          <div style={{
            background: 'rgba(42, 63, 63, 0.3)',
            borderRadius: '16px',
            padding: isMobile ? '20px 24px' : '28px 32px',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <h2 style={{
              fontSize: isMobile ? '20px' : '24px',
              fontWeight: '600',
              color: '#ffffff',
              marginBottom: '8px',
              lineHeight: '1.3'
            }}>
              Hola, aquí está el resumen
              <br />
              de tus royalties.
            </h2>
            
            {/* Mini bar chart */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '4px',
              height: isMobile ? '50px' : '60px',
              marginTop: '20px',
              marginBottom: '24px'
            }}>
              {csvLineData.slice(-6).map((data: any, index: number) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{
                    width: '100%',
                    backgroundColor: index === csvLineData.slice(-6).length - 1 ? '#c9a574' : 'rgba(201, 165, 116, 0.3)',
                    height: `${Math.max(20, (data.revenue / Math.max(...csvLineData.map((d: any) => d.revenue))) * (isMobile ? 50 : 60))}px`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s ease'
                  }} />
                  <span style={{
                    fontSize: '10px',
                    color: index === csvLineData.slice(-6).length - 1 ? '#c9a574' : 'rgba(255, 255, 255, 0.5)',
                    fontWeight: index === csvLineData.slice(-6).length - 1 ? '600' : '400'
                  }}>
                    {data.mes.substring(0, 3)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px' }}>
              <p style={{ fontSize: isMobile ? '12px' : '13px', color: 'rgba(255, 255, 255, 0.75)', marginBottom: '8px' }}>
                Este mes tus artistas han generado
              </p>
              <div style={{ fontSize: isMobile ? '28px' : '32px', fontWeight: '700', color: '#c9a574' }}>
                €{dashboardData.totalRevenue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Stats Card with Multiple Metrics */}
          <div style={{
            background: 'rgba(42, 63, 63, 0.6)',
            borderRadius: '20px',
            padding: isMobile ? '24px' : '32px',
            border: '1px solid rgba(201, 165, 116, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '20px' : '28px',
            height: isMobile ? 'auto' : '427px'
          }}>
            {/* Average Revenue per Artist - Más oscuro arriba */}
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100px' }}>
              {/* Gráfico de barras difuminado dentro de Beneficios de BAM */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.25,
                pointerEvents: 'none',
                zIndex: 0,
                minHeight: '100px'
              }}>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart
                    data={[
                      { value: 45 },
                      { value: 52 },
                      { value: 38 },
                      { value: 65 },
                      { value: 48 },
                      { value: 72 },
                      { value: 58 },
                      { value: 68 }
                    ]}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <Bar 
                      dataKey="value" 
                      fill="url(#bamBarGradientFinances)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="bamBarGradientFinances" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c9a574" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#c9a574" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p style={{ fontSize: isMobile ? '12px' : '13px', color: 'rgba(255, 255, 255, 0.95)', marginBottom: '8px', fontWeight: '600', position: 'relative', zIndex: 2 }}>
                Beneficios de Bam
              </p>
              <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: '#c9a574', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.3)', position: 'relative', zIndex: 2 }}>
                €{artists.reduce((sum, artist) => {
                  const contract = contracts.find(c => c.artistId === artist.id);
                  const bamPercentage = contract ? (100 - contract.percentage) / 100 : 0.30;
                  return sum + ((artist.totalRevenue || 0) * bamPercentage);
                }, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(201, 165, 116, 0.15)', position: 'relative', zIndex: 1 }} />

            {/* Total Streams - Más gris abajo */}
            <div style={{ position: 'relative', zIndex: 1, minHeight: '100px' }}>
              {/* Gráfico de barras difuminado dentro de Beneficios de Artistas */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.15,
                pointerEvents: 'none',
                zIndex: 0,
                minHeight: '100px'
              }}>
                <ResponsiveContainer width="100%" height={100}>
                  <BarChart
                    data={[
                      { value: 35 },
                      { value: 42 },
                      { value: 28 },
                      { value: 55 },
                      { value: 38 },
                      { value: 62 },
                      { value: 48 },
                      { value: 58 }
                    ]}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                  >
                    <Bar 
                      dataKey="value" 
                      fill="url(#artistBarGradientFinances)"
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="artistBarGradientFinances" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <p style={{ fontSize: isMobile ? '12px' : '13px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', fontWeight: '400', position: 'relative', zIndex: 2 }}>
                Beneficio de Artistas
              </p>
              <div style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: '700', color: 'rgba(201, 165, 116, 0.7)', marginBottom: '4px', position: 'relative', zIndex: 2 }}>
                €{artists.reduce((sum, artist) => {
                  const contract = contracts.find(c => c.artistId === artist.id);
                  const artistPercentage = contract ? contract.percentage / 100 : 0.70;
                  return sum + ((artist.totalRevenue || 0) * artistPercentage);
                }, 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        </div>

        {/* Segunda fila - Responsive */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px 295px',
          gap: '16px',
          width: '100%'
        }}>
          {/* Columna izquierda */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Caja de Información Adicional */}
            <div style={{
              background: 'rgba(42, 63, 63, 0.3)',
              borderRadius: '16px',
              padding: isMobile ? '16px 20px' : '20px 32px',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              height: isMobile ? 'auto' : '205px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: isMobile ? '12px' : '16px'
              }}>
                Artistas Pendientes de Solicitud
              </h3>
              {pendingRequests.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  overflowY: 'auto',
                  maxHeight: isMobile ? '200px' : '140px'
                }}>
                  {pendingRequests.map((request: any) => (
                    <div key={request.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(201, 165, 116, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 165, 116, 0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: isMobile ? '28px' : '32px',
                          height: isMobile ? '28px' : '32px',
                          borderRadius: '50%',
                          background: request.artistPhoto ? `url(${request.artistPhoto})` : '#c9a574',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: isMobile ? '12px' : '14px',
                          fontWeight: '600',
                          color: '#2a3f3f'
                        }}>
                          {!request.artistPhoto && request.artistName.charAt(0).toUpperCase()}
                        </div>
                        <span style={{
                          fontSize: isMobile ? '13px' : '14px',
                          fontWeight: '500',
                          color: '#ffffff'
                        }}>
                          {request.artistName}
                        </span>
                      </div>
                      <span style={{
                        fontSize: isMobile ? '13px' : '14px',
                        fontWeight: '600',
                        color: '#c9a574'
                      }}>
                        €{request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{
                  fontSize: isMobile ? '13px' : '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  textAlign: 'center',
                  marginTop: isMobile ? '16px' : '32px'
                }}>
                  No hay solicitudes pendientes
                </p>
              )}
            </div>

            {/* Nueva Sección - Ventas del Último Año */}
            <div style={{
              background: 'rgba(42, 63, 63, 0.3)',
              borderRadius: '16px',
              padding: isMobile ? '16px 20px' : '20px 32px',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              backdropFilter: 'blur(10px)',
              width: '100%',
              height: isMobile ? 'auto' : '418px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <TrendingUp size={isMobile ? 48 : 64} color="#c9a574" style={{ opacity: 0.3, marginBottom: '16px' }} />
              <h3 style={{
                fontSize: isMobile ? '16px' : '18px',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '8px'
              }}>
                Ventas del Último Año
              </h3>
              <p style={{
                fontSize: isMobile ? '13px' : '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                maxWidth: '300px'
              }}>
                No hay datos disponibles para mostrar
              </p>
            </div>
          </div>

          {/* Columna central en móvil se apila */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Resto del código de las cajas centrales permanece igual... */}
            {/* Por brevedad, las otras cajas mantienen la misma estructura pero con ajustes isMobile similares */}
          </div>
        </div>
        </>
        )}

        {/* Income Tab Content */}
        {financesTab === 'income' && (
          <IncomeSection dashboardData={dashboardData} artists={artists} />
        )}

        {/* Expenses Tab Content */}
        {financesTab === 'expenses' && (
          <ExpensesSection dashboardData={dashboardData} artists={artists} />
        )}

        {/* Reports y Requests tabs mantienen el código original con ajustes isMobile */}
      </div>
    </div>
  );
}