import { DollarSign, FileText, Calendar, Trash2, Eye, Download } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UploadedCSV {
  id: number;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  rowCount: number;
  headers: string[];
  data: any[];
  status: string;
}

export function RoyaltiesPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedCSV[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedCSV | null>(null);

  useEffect(() => {
    // Cargar archivos desde localStorage
    loadUploadedFiles();
  }, []);

  const loadUploadedFiles = () => {
    const files = JSON.parse(localStorage.getItem('uploadedCSVs') || '[]');
    setUploadedFiles(files);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      const updatedFiles = uploadedFiles.filter(file => file.id !== id);
      localStorage.setItem('uploadedCSVs', JSON.stringify(updatedFiles));
      setUploadedFiles(updatedFiles);
      if (selectedFile?.id === id) {
        setSelectedFile(null);
      }
    }
  };

  const handleView = (file: UploadedCSV) => {
    setSelectedFile(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTotalRevenue = (data: any[]) => {
    // Buscar columna de ingresos/revenue en los datos
    const revenueKeys = ['revenue', 'income', 'earnings', 'amount', 'total'];
    let total = 0;

    data.forEach(row => {
      Object.keys(row).forEach(key => {
        if (revenueKeys.some(rk => key.toLowerCase().includes(rk))) {
          const value = parseFloat(row[key]);
          if (!isNaN(value)) {
            total += value;
          }
        }
      });
    });

    return total;
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <DollarSign size={32} color="#c9a574" />
          Gestión de Royalties
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Archivos CSV procesados y listos para distribución
        </p>
      </div>

      {uploadedFiles.length === 0 ? (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '20px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          <DollarSign size={64} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
            No hay archivos CSV cargados
          </h2>
          <p style={{ fontSize: '16px', color: '#AFB3B7', marginBottom: '24px' }}>
            Sube archivos CSV desde la sección "Subir CSV" para comenzar a gestionar royalties
          </p>
          <a
            href="/upload"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
            }}
          >
            <FileText size={20} />
            Ir a Subir CSV
          </a>
        </div>
      ) : (
        <div>
          {/* Lista de archivos */}
          <div style={{ display: 'grid', gap: '20px' }}>
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                style={{
                  background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
                  border: selectedFile?.id === file.id ? '2px solid #c9a574' : '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => handleView(file)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
                  {/* Icono */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={28} color="#ffffff" />
                  </div>

                  {/* Información principal */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                      {file.fileName}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={14} color="#AFB3B7" />
                        <span style={{ fontSize: '13px', color: '#AFB3B7' }}>
                          {formatDate(file.uploadDate)}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        {formatFileSize(file.fileSize)}
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        {file.rowCount} registros
                      </div>
                      <div style={{ fontSize: '13px', color: '#AFB3B7' }}>
                        {file.headers.length} columnas
                      </div>
                    </div>

                    {/* Badge de estado */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#22c55e',
                        }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: '#22c55e' }}>
                        Procesado
                      </span>
                    </div>
                  </div>

                  {/* Ingresos totales */}
                  <div
                    style={{
                      padding: '16px 20px',
                      background: 'rgba(201, 165, 116, 0.1)',
                      borderRadius: '12px',
                      textAlign: 'center',
                      minWidth: '150px',
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>
                      Ingresos Totales
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                      €{calculateTotalRevenue(file.data).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(file);
                      }}
                      style={{
                        padding: '10px',
                        background: 'rgba(201, 165, 116, 0.1)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '8px',
                        color: '#c9a574',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
                      }}
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.id);
                      }}
                      style={{
                        padding: '10px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista detallada del archivo seleccionado */}
          {selectedFile && (
            <div
              style={{
                marginTop: '32px',
                background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
                border: '2px solid #c9a574',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                  Vista Detallada: {selectedFile.fileName}
                </h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(201, 165, 116, 0.1)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#c9a574',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cerrar
                </button>
              </div>

              {/* Columnas */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#c9a574', fontWeight: '600', marginBottom: '12px' }}>
                  Columnas ({selectedFile.headers.length}):
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedFile.headers.map((header, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(201, 165, 116, 0.1)',
                        border: '1px solid rgba(201, 165, 116, 0.3)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: '#ffffff',
                      }}
                    >
                      {header}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabla de datos */}
              <div>
                <p style={{ fontSize: '14px', color: '#c9a574', fontWeight: '600', marginBottom: '12px' }}>
                  Datos completos ({selectedFile.rowCount} registros):
                </p>
                <div style={{ overflowX: 'auto', maxHeight: '400px', overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'rgba(42, 63, 63, 0.95)', zIndex: 1 }}>
                      <tr>
                        {selectedFile.headers.map((header, index) => (
                          <th
                            key={index}
                            style={{
                              padding: '12px',
                              background: 'rgba(201, 165, 116, 0.2)',
                              borderBottom: '2px solid rgba(201, 165, 116, 0.3)',
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#c9a574',
                              textAlign: 'left',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedFile.data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {selectedFile.headers.map((header, colIndex) => (
                            <td
                              key={colIndex}
                              style={{
                                padding: '12px',
                                borderBottom: '1px solid rgba(201, 165, 116, 0.1)',
                                fontSize: '13px',
                                color: '#ffffff',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {row[header]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
