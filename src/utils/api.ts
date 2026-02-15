// Configuración centralizada del API
// En desarrollo local (localhost) usamos el proxy de Vite
// En producción y preview usamos la URL completa
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// IMPORTANTE: En preview de Figma Make, siempre usar la URL completa
const API_BASE_URL = isLocalhost ? '' : 'https://app.bigartist.es';

console.log('🔧 API Configuration:', {
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  isLocalhost,
  API_BASE_URL,
  environment: process.env.NODE_ENV
});

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // Finances
  PAYMENT_REQUESTS: `${API_BASE_URL}/api/finances/payment-requests`,
  EXPENSES: `${API_BASE_URL}/api/finances/expenses`,
  INCOME: `${API_BASE_URL}/api/finances/income`,
  CONTRACTS: `${API_BASE_URL}/api/finances/contracts`,
  REPORTS: `${API_BASE_URL}/api/finances/reports`,
  STATS: `${API_BASE_URL}/api/finances/stats`,
  
  // Artists
  ARTISTS: `${API_BASE_URL}/api/artists`,
  
  // Tracks
  TRACKS: `${API_BASE_URL}/api/tracks`,
  
  // CSV Upload
  UPLOAD_CSV: `${API_BASE_URL}/api/upload/csv`,
};

// Helper function para hacer requests con autenticación
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error('Sesión expirada');
    }
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// Función de login
export const login = async (email: string, password: string) => {
  try {
    console.log('🔍 Intentando login a:', API_ENDPOINTS.LOGIN);
    console.log('📧 Email:', email);
    
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);

    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || 'Error en el login');
    }

    return data;
  } catch (error) {
    console.error('❌ Error en login:', error);
    
    // Si es un error de red (Failed to fetch)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No se puede conectar al servidor. Verifica que el backend esté corriendo en https://app.bigartist.es');
    }
    
    throw error;
  }
};

// Función de logout
export const logout = async () => {
  try {
    await apiRequest(API_ENDPOINTS.LOGOUT, { method: 'POST' });
  } finally {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};