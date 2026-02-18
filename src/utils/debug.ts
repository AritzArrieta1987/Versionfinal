// Utilidad de debug para verificación básica del sistema

export const debugAPI = () => {
  // Debug info removida en producción - solo disponible en desarrollo local
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return;
  }
  
  console.group('🔍 Debug BigArtist API');
  
  // Verificar entorno
  console.log('📍 Hostname:', window.location.hostname);
  console.log('📍 Protocol:', window.location.protocol);
  
  // Verificar si es localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  console.log('🏠 Is Localhost:', isLocalhost);
  
  // Mostrar URL del API
  const apiBase = isLocalhost ? '' : 'https://app.bigartist.es';
  console.log('🌐 API Base URL:', apiBase || 'Proxy Vite (relativo)');
  
  // Verificar localStorage sin mostrar datos sensibles
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  console.log('🔐 Token almacenado:', token ? '✅ Sí' : '❌ No');
  console.log('👤 Usuario almacenado:', user ? '✅ Sí' : '❌ No');
  
  console.groupEnd();
};

// Probar conexión al API
export const testAPIConnection = async () => {
  // Debug info removida en producción - solo disponible en desarrollo local
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return;
  }
  
  console.group('🧪 Test de Conexión al API');
  
  try {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    const apiBase = isLocalhost ? '' : 'https://app.bigartist.es';
    const endpoint = `${apiBase}/api/health`;
    
    console.log('📡 Probando endpoint:', endpoint);
    
    const response = await fetch(endpoint);
    console.log('📊 Status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Conectada');
    } else {
      console.error('❌ Respuesta con error');
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
  
  console.groupEnd();
};

// Exportar para usar en consola del navegador (solo en desarrollo local)
if (typeof window !== 'undefined') {
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
  if (isLocalhost) {
    (window as any).debugBigArtist = {
      info: debugAPI,
      testConnection: testAPIConnection,
    };
    
    console.log('💡 Debug tools disponibles en desarrollo local');
  }
}