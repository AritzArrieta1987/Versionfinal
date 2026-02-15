// Utilidad de debug para verificar configuración

export const debugAPI = () => {
  console.group('🔍 Debug BigArtist API');
  
  // Verificar entorno
  console.log('📍 Hostname:', window.location.hostname);
  console.log('📍 Protocol:', window.location.protocol);
  console.log('📍 Port:', window.location.port);
  console.log('📍 Origin:', window.location.origin);
  
  // Verificar si es localhost
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  console.log('🏠 Is Localhost:', isLocalhost);
  
  // Mostrar URL del API
  const apiBase = isLocalhost ? '' : 'https://app.bigartist.es';
  console.log('🌐 API Base URL:', apiBase || 'Proxy Vite (relativo)');
  console.log('🔗 Login Endpoint:', `${apiBase}/api/auth/login`);
  
  // Verificar localStorage
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  console.log('🔐 Token almacenado:', token ? '✅ Sí' : '❌ No');
  console.log('👤 Usuario almacenado:', user ? '✅ Sí' : '❌ No');
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('👤 Datos del usuario:', userData);
    } catch (e) {
      console.error('❌ Error parseando usuario:', e);
    }
  }
  
  console.groupEnd();
};

// Probar conexión al API
export const testAPIConnection = async () => {
  console.group('🧪 Test de Conexión al API');
  
  try {
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    const apiBase = isLocalhost ? '' : 'https://app.bigartist.es';
    const endpoint = `${apiBase}/api/finances/stats`;
    
    console.log('📡 Probando endpoint:', endpoint);
    
    const response = await fetch(endpoint);
    console.log('📊 Status:', response.status);
    console.log('📊 Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Respuesta exitosa:', data);
    } else {
      console.error('❌ Respuesta con error');
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
  }
  
  console.groupEnd();
};

// Exportar para usar en consola del navegador
if (typeof window !== 'undefined') {
  (window as any).debugBigArtist = {
    info: debugAPI,
    testConnection: testAPIConnection,
  };
  
  console.log('💡 Debug tools disponibles:');
  console.log('  - window.debugBigArtist.info() - Ver configuración');
  console.log('  - window.debugBigArtist.testConnection() - Probar conexión al API');
}
