import { LayoutDashboard } from 'lucide-react';

export function HomePage() {
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
    </div>
  );
}