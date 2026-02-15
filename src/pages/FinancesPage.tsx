import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { ExpensesSection } from '../components/admin/ExpensesSection';
import { IncomeSection } from '../components/admin/IncomeSection';

export function FinancesPage() {
  const [activeSection, setActiveSection] = useState<'income' | 'expenses'>('income');
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalArtists: 0,
    totalSongs: 0,
    totalStreams: 0
  });
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFinanceData();
  }, []);

  const loadFinanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Cargar resumen financiero desde el backend
      const overviewRes = await fetch('https://app.bigartist.es/api/finances/overview', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setDashboardData({
          totalRevenue: data.data.totalRevenue || 0,
          totalArtists: 0,
          totalSongs: 0,
          totalStreams: 0
        });
      }

      // Cargar artistas (mock por ahora, luego conectaremos al endpoint real)
      setArtists([
        { id: 1, name: 'Artista 1', totalRevenue: 5000 },
        { id: 2, name: 'Artista 2', totalRevenue: 3000 },
        { id: 3, name: 'Artista 3', totalRevenue: 2000 }
      ]);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#AFB3B7' }}>
        <p>Cargando datos financieros...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.1) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={28} color="#c9a574" />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            Finanzas
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '32px',
        borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
        paddingBottom: '16px'
      }}>
        <button
          onClick={() => setActiveSection('income')}
          style={{
            padding: '12px 32px',
            background: activeSection === 'income' 
              ? 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.1) 100%)'
              : 'transparent',
            border: activeSection === 'income'
              ? '1px solid rgba(201, 165, 116, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: activeSection === 'income' ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Ingresos
        </button>
        <button
          onClick={() => setActiveSection('expenses')}
          style={{
            padding: '12px 32px',
            background: activeSection === 'expenses'
              ? 'linear-gradient(135deg, rgba(201, 165, 116, 0.2) 0%, rgba(201, 165, 116, 0.1) 100%)'
              : 'transparent',
            border: activeSection === 'expenses'
              ? '1px solid rgba(201, 165, 116, 0.4)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            color: activeSection === 'expenses' ? '#c9a574' : 'rgba(255, 255, 255, 0.6)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Gastos
        </button>
      </div>

      {/* Content */}
      {activeSection === 'income' && (
        <IncomeSection dashboardData={dashboardData} artists={artists} />
      )}
      
      {activeSection === 'expenses' && (
        <ExpensesSection dashboardData={dashboardData} artists={artists} />
      )}
    </div>
  );
}
