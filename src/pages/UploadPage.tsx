import { Upload } from 'lucide-react';

export function UploadPage() {
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
          <Upload size={32} color="#c9a574" />
          Subir Archivo CSV
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Carga archivos CSV de The Orchard para procesar royalties
        </p>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        borderRadius: '20px',
        padding: '48px',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)'
      }}>
        <Upload size={64} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
          Sección en Construcción
        </h2>
        <p style={{ fontSize: '16px', color: '#AFB3B7' }}>
          La carga de archivos CSV estará disponible próximamente
        </p>
      </div>
    </div>
  );
}
