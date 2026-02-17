import { Package } from 'lucide-react';
import { useState, useEffect } from 'react';

export function PhysicalSalesPage() {
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: isMobile ? '28px' : '32px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <Package size={32} color="#c9a574" />
          Ventas Físicas
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Gestión de discos físicos y merchandising
        </p>
      </div>

      {/* En construcción */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '20px',
          padding: isMobile ? '48px 24px' : '80px 48px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <div
          style={{
            width: isMobile ? '80px' : '120px',
            height: isMobile ? '80px' : '120px',
            borderRadius: '50%',
            background: 'rgba(201, 165, 116, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Package size={isMobile ? 40 : 60} color="#c9a574" />
        </div>

        <div>
          <h2
            style={{
              fontSize: isMobile ? '24px' : '32px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '12px',
            }}
          >
            En Construcción
          </h2>
          <p
            style={{
              fontSize: isMobile ? '14px' : '16px',
              color: '#AFB3B7',
              lineHeight: '1.6',
              maxWidth: '500px',
            }}
          >
            Esta sección estará disponible próximamente para gestionar las ventas de discos físicos, vinilos, CDs y
            merchandising de tus artistas.
          </p>
        </div>

        <div
          style={{
            padding: '16px 24px',
            background: 'rgba(201, 165, 116, 0.1)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '12px',
          }}
        >
          <p
            style={{
              fontSize: '13px',
              color: '#c9a574',
              fontWeight: '600',
            }}
          >
            🚧 Funcionalidad en desarrollo
          </p>
        </div>
      </div>
    </div>
  );
}