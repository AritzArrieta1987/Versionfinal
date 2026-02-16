import { Upload, FileText, Check, X, AlertCircle, Download } from 'lucide-react';
import { useState, useRef } from 'react';

interface CSVRow {
  [key: string]: string;
}

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      processFile(droppedFile);
    } else {
      setErrorMessage('Por favor, sube solo archivos CSV (.csv)');
      setUploadStatus('error');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (file: File) => {
    setFile(file);
    setUploadStatus('idle');
    setErrorMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      setErrorMessage('El archivo CSV está vacío');
      setUploadStatus('error');
      return;
    }

    // Obtener headers
    const headerLine = lines[0];
    const parsedHeaders = headerLine.split(',').map(h => h.trim());
    setHeaders(parsedHeaders);

    // Parsear datos
    const data: CSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: CSVRow = {};
      parsedHeaders.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }

    setCsvData(data);
  };

  const handleUpload = async () => {
    if (!file || csvData.length === 0) return;

    setIsProcessing(true);

    // Simular procesamiento (en producción, aquí harías la llamada a la API)
    setTimeout(() => {
      // Guardar el CSV procesado en localStorage
      const uploadedFile = {
        id: Date.now(),
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        rowCount: csvData.length,
        headers: headers,
        data: csvData,
        status: 'processed'
      };

      // Obtener archivos existentes
      const existingFiles = JSON.parse(localStorage.getItem('uploadedCSVs') || '[]');
      existingFiles.unshift(uploadedFile); // Agregar al inicio
      localStorage.setItem('uploadedCSVs', JSON.stringify(existingFiles));

      setIsProcessing(false);
      setUploadStatus('success');
      
      // Aquí harías la llamada real a la API:
      // try {
      //   const formData = new FormData();
      //   formData.append('file', file);
      //   const response = await fetch('/api/upload-csv', {
      //     method: 'POST',
      //     body: formData,
      //   });
      //   if (response.ok) {
      //     setUploadStatus('success');
      //   } else {
      //     setUploadStatus('error');
      //     setErrorMessage('Error al procesar el archivo');
      //   }
      // } catch (error) {
      //   setUploadStatus('error');
      //   setErrorMessage('Error de conexión');
      // }
    }, 2000);
  };

  const handleReset = () => {
    setFile(null);
    setCsvData([]);
    setHeaders([]);
    setUploadStatus('idle');
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
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
          <Upload size={32} color="#c9a574" />
          Subir Archivo CSV
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Carga archivos CSV de The Orchard para procesar royalties automáticamente
        </p>
      </div>

      {/* Zona de carga */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: isDragging
            ? 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: isDragging
            ? '2px dashed #c9a574'
            : '2px dashed rgba(201, 165, 116, 0.3)',
          borderRadius: '20px',
          padding: '48px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '32px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(201, 165, 116, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <Upload size={40} color="#c9a574" />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginBottom: '12px' }}>
          {file ? file.name : 'Arrastra tu archivo CSV aquí'}
        </h2>

        <p style={{ fontSize: '16px', color: '#AFB3B7', marginBottom: '16px' }}>
          {file
            ? `${formatFileSize(file.size)} • ${csvData.length} filas`
            : 'o haz clic para seleccionar un archivo'}
        </p>

        {!file && (
          <div
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              marginTop: '8px',
            }}
          >
            Seleccionar Archivo
          </div>
        )}
      </div>

      {/* Información del archivo */}
      {file && csvData.length > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.6) 0%, rgba(30, 47, 47, 0.8) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <FileText size={24} color="#c9a574" />
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Archivo cargado correctamente
              </h3>
              <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
                {csvData.length} registros encontrados • {headers.length} columnas
              </p>
            </div>
          </div>

          {/* Preview de columnas */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', color: '#c9a574', fontWeight: '600', marginBottom: '12px' }}>
              Columnas detectadas:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {headers.map((header, index) => (
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

          {/* Preview de datos */}
          <div>
            <p style={{ fontSize: '14px', color: '#c9a574', fontWeight: '600', marginBottom: '12px' }}>
              Vista previa (primeras 3 filas):
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {headers.map((header, index) => (
                      <th
                        key={index}
                        style={{
                          padding: '12px',
                          background: 'rgba(201, 165, 116, 0.1)',
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
                  {csvData.slice(0, 3).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {headers.map((header, colIndex) => (
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

      {/* Mensajes de estado */}
      {uploadStatus === 'success' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <Check size={24} color="#22c55e" />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#22c55e', marginBottom: '2px' }}>
              Archivo procesado exitosamente
            </p>
            <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
              Los royalties han sido calculados y están listos para revisión
            </p>
          </div>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <AlertCircle size={24} color="#ef4444" />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444', marginBottom: '2px' }}>
              Error al procesar el archivo
            </p>
            <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
              {errorMessage || 'Por favor, verifica el formato del archivo CSV'}
            </p>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      {file && csvData.length > 0 && (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button
            onClick={handleReset}
            disabled={isProcessing}
            style={{
              flex: '1',
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 24px',
              background: 'rgba(201, 165, 116, 0.1)',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '12px',
              color: '#c9a574',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.5 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            <X size={20} />
            Cancelar
          </button>

          <button
            onClick={handleUpload}
            disabled={isProcessing || uploadStatus === 'success'}
            style={{
              flex: '1',
              minWidth: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px 24px',
              background:
                isProcessing || uploadStatus === 'success'
                  ? 'rgba(201, 165, 116, 0.5)'
                  : 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isProcessing || uploadStatus === 'success' ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow:
                isProcessing || uploadStatus === 'success'
                  ? 'none'
                  : '0 4px 12px rgba(201, 165, 116, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing && uploadStatus !== 'success') {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isProcessing && uploadStatus !== 'success') {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
              }
            }}
          >
            {isProcessing ? (
              <>Procesando...</>
            ) : uploadStatus === 'success' ? (
              <>
                <Check size={20} />
                Procesado
              </>
            ) : (
              <>
                <Upload size={20} />
                Procesar y Subir
              </>
            )}
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div
        style={{
          marginTop: '32px',
          padding: '20px',
          background: 'rgba(42, 63, 63, 0.3)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <AlertCircle size={20} color="#c9a574" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#c9a574', marginBottom: '8px' }}>
              Formato del archivo CSV
            </p>
            <ul style={{ fontSize: '13px', color: '#AFB3B7', paddingLeft: '20px', margin: 0 }}>
              <li style={{ marginBottom: '4px' }}>El archivo debe estar en formato CSV (separado por comas)</li>
              <li style={{ marginBottom: '4px' }}>La primera fila debe contener los nombres de las columnas</li>
              <li style={{ marginBottom: '4px' }}>Formato compatible con The Orchard</li>
              <li>Tamaño máximo recomendado: 10 MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}