import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  Music, 
  FileText, 
  DollarSign, 
  Bell, 
  LogOut,
  Upload,
  Settings,
  Wallet
} from 'lucide-react';
import logoImage from 'figma:asset/aa0296e2522220bcfcda71f86c708cb2cbc616b9.png';
import backgroundImage from 'figma:asset/0a2a9faa1b59d5fa1e388a2eec5b08498dd7a493.png';

interface AdminLayoutProps {
  onLogout: () => void;
}

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
  }>>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Tabs del menú
  const tabs = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Artistas', path: '/artists', icon: Users },
    { name: 'Catálogo', path: '/catalog', icon: Music },
    { name: 'Royalties', path: '/royalties', icon: DollarSign },
    { name: 'Finanzas', path: '/finances', icon: Wallet },
    { name: 'Contratos', path: '/contracts', icon: FileText },
    { name: 'Subir CSV', path: '/upload', icon: Upload },
  ];

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cerrar notificaciones al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Obtener el tab activo basado en la ruta
  const getActiveTab = () => {
    const currentTab = tabs.find(tab => tab.path === location.pathname);
    return currentTab ? currentTab.name : 'Dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* IMAGEN DE FONDO GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.25,
        filter: 'blur(0px)',
        zIndex: 0
      }} />

      {/* OVERLAY VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)',
        backdropFilter: 'blur(2px)',
        opacity: 0.75,
        zIndex: 0
      }} />

      {/* CAPA DE TINTE VERDE GLOBAL */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 32, 39, 0.3)',
        mixBlendMode: 'multiply' as const,
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header con menú horizontal */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: isMobile ? '12px 20px' : '16px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: isMobile ? '16px' : '32px',
          background: 'linear-gradient(180deg, rgba(15, 32, 39, 0.4) 0%, rgba(15, 32, 39, 0.2) 100%)',
          borderBottom: '1px solid rgba(201, 165, 116, 0.15)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img 
              src={logoImage}
              alt="BIGARTIST"
              style={{
                height: isMobile ? '32px' : '40px',
                transition: 'all 0.4s ease',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/')}
            />
          </div>

          {/* Tabs del menú - Desktop */}
          <div style={{ display: isMobile ? 'none' : 'flex', gap: '8px', flex: 1, justifyContent: 'center' }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => navigate(tab.path)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(201, 165, 116, 0.15)' : 'rgba(0, 0, 0, 0)',
                    color: isActive ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#c9a574';
                      e.currentTarget.style.background = 'rgba(201, 165, 116, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0)';
                    }
                  }}
                >
                  <Icon size={18} />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Notificaciones y Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ position: 'relative' }} ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: showNotifications 
                    ? 'rgba(201, 165, 116, 0.2)' 
                    : 'rgba(42, 63, 63, 0.4)',
                  border: `1px solid ${showNotifications ? 'rgba(201, 165, 116, 0.4)' : 'rgba(201, 165, 116, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                <Bell size={20} color="#c9a574" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    border: '2px solid #0f2027'
                  }} />
                )}
              </button>

              {/* Notification Panel */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: isMobile ? '300px' : '380px',
                  maxHeight: '500px',
                  background: 'linear-gradient(135deg, rgba(20, 35, 35, 0.98) 0%, rgba(15, 30, 30, 0.98) 100%)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(20px)',
                  overflow: 'hidden',
                  zIndex: 1000
                }}>
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                      Notificaciones
                    </h3>
                    <div style={{ fontSize: '12px', color: '#AFB3B7' }}>
                      {notifications.filter(n => !n.read).length} nuevas
                    </div>
                  </div>

                  <div style={{
                    maxHeight: '420px',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                  }}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '32px 20px',
                        textAlign: 'center',
                        color: '#6b7280'
                      }}>
                        <Bell size={32} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                        <p style={{ fontSize: '14px' }}>No hay notificaciones</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                            background: notification.read ? 'transparent' : 'rgba(201, 165, 116, 0.05)',
                            cursor: 'pointer',
                            transition: 'background 0.2s ease'
                          }}
                          onClick={() => {
                            setNotifications(notifications.map(n => 
                              n.id === notification.id ? { ...n, read: true } : n
                            ));
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#c9a574' }}>
                              {notification.title}
                            </span>
                            <span style={{ fontSize: '11px', color: '#6b7280' }}>
                              {notification.time}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#AFB3B7', margin: 0, lineHeight: '1.4' }}>
                            {notification.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {!isMobile && (
              <button
                onClick={onLogout}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                <LogOut size={20} color="#ef4444" />
              </button>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div style={{
          padding: isMobile ? '20px' : '32px 48px',
          paddingBottom: isMobile ? '100px' : '32px', // Espacio extra en mobile para bottom nav
          maxWidth: '1600px',
          margin: '0 auto'
        }}>
          <Outlet />
        </div>

        {/* Bottom Navigation - Solo Mobile */}
        {isMobile && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: 'linear-gradient(180deg, rgba(15, 32, 39, 0.95) 0%, rgba(10, 25, 30, 0.98) 100%)',
            borderTop: '1px solid rgba(201, 165, 116, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.4)',
            padding: '8px 0 calc(8px + env(safe-area-inset-bottom))',
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.name;
              return (
                <button
                  key={tab.name}
                  onClick={() => navigate(tab.path)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px 2px',
                    border: 'none',
                    background: 'transparent',
                    color: isActive ? '#c9a574' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Icon size={18} />
                  <span style={{
                    fontSize: '9px',
                    fontWeight: isActive ? '600' : '500',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}>
                    {tab.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}