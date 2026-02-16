import { useState, useEffect } from 'react';
import { FinancesPanel } from '../components/admin/FinancesPanel';

export function FinancesPage() {
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalArtists: 0,
    totalSongs: 0,
    totalStreams: 0,
    monthlyData: []
  });
  const [artists, setArtists] = useState<any[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
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
          totalArtists: data.data.totalArtists || 0,
          totalSongs: data.data.totalSongs || 0,
          totalStreams: data.data.totalStreams || 0,
          monthlyData: data.data.monthlyData || []
        });
      }

      // Cargar artistas desde el backend
      const artistsRes = await fetch('https://app.bigartist.es/api/artists', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (artistsRes.ok) {
        const artistsData = await artistsRes.json();
        setArtists(artistsData.artists || []);
      }

      // Cargar solicitudes de pago desde el backend
      const paymentsRes = await fetch('https://app.bigartist.es/api/payments/requests', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json();
        setPaymentRequests(paymentsData.requests || []);
      }

    } catch (error) {
      console.error('Error cargando datos financieros:', error);
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
    <FinancesPanel
      dashboardData={dashboardData}
      artists={artists}
      paymentRequests={paymentRequests}
      setPaymentRequests={setPaymentRequests}
      notifications={notifications}
      setNotifications={setNotifications}
    />
  );
}