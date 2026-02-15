import { useState } from 'react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
      } else {
        setError(data.message || 'Error en el login');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#2a3f3f] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#c9a574] mb-4">✅ Login Exitoso</h1>
          <p className="text-white text-lg">Bienvenido al sistema BIGARTIST ROYALTIES</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a3f3f] flex flex-col lg:flex-row">
      {/* LADO IZQUIERDO - LOGO */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center bg-gradient-to-br from-[#0d1f23] via-[#132e35] to-[#2d4a53]">
        <div className="text-center px-12">
          <h1 className="text-[72px] font-black text-[#c9a574] tracking-[0.1em] mb-6 drop-shadow-[0_0_40px_rgba(201,165,116,0.4)]">
            BIGARTIST
          </h1>
          <div className="h-[2px] w-24 mx-auto mb-6 bg-gradient-to-r from-transparent via-[#c9a574] to-transparent shadow-[0_0_10px_rgba(201,165,116,0.5)]"></div>
          <p className="text-[#c9a574] text-xl tracking-[0.3em] uppercase font-light">
            Royalties Management
          </p>
        </div>
      </div>

      {/* LADO DERECHO - FORMULARIO */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-[#0d1f23]/60">
        <div className="w-full max-w-md">
          {/* Logo móvil */}
          <div className="mb-12 lg:hidden text-center">
            <h1 className="text-5xl font-black text-[#c9a574] tracking-wider mb-4">BIGARTIST</h1>
            <div className="h-[1px] w-20 mx-auto bg-gradient-to-r from-transparent via-[#c9a574] to-transparent"></div>
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-white mb-2">Admin Panel</h2>
          <p className="text-gray-400 mb-8">Ingresa tus credenciales para continuar</p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
              <span className="text-lg">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/20 border-2 border-[#c9a574]/30 rounded-lg text-white placeholder:text-gray-500 focus:border-[#c9a574] focus:bg-black/30 focus:outline-none transition-all duration-200"
                placeholder="admin@bigartist.es"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-black/20 border-2 border-[#c9a574]/30 rounded-lg text-white placeholder:text-gray-500 focus:border-[#c9a574] focus:bg-black/30 focus:outline-none transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#c9a574] transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-8 bg-gradient-to-r from-[#c9a574] to-[#d4b589] text-[#0D1F23] text-sm font-bold rounded-lg uppercase tracking-[0.1em] shadow-lg shadow-[#c9a574]/30 hover:shadow-xl hover:shadow-[#c9a574]/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-700/50 text-center">
            <p className="text-xs text-gray-500">
              © 2026 Big Artist Management S.L.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
