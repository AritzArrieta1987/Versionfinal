import { FileText, Plus, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { ContractCard } from '../components/admin/ContractCard';
import { AddContractModal } from '../components/admin/AddContractModal';

// Mock data - En producción esto vendría de la API
const MOCK_CONTRACTS = [
  {
    id: 1,
    artistName: 'Luna García',
    artistPhoto: 'https://images.unsplash.com/photo-1615748561835-cff146a0b3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBzaW5nZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzExOTk1Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Contrato 360°',
    royaltyPercentage: 18.5,
    startDate: '2024-01-15',
    endDate: '2027-01-15',
    status: 'active' as const,
    totalRevenue: 45789.50,
    isPhysical: true,
    workBilling: 25000,
  },
  {
    id: 2,
    artistName: 'Carlos Beats',
    artistPhoto: 'https://images.unsplash.com/photo-1608357501758-430201af2e56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcmFwcGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMTk5NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Distribución Digital',
    royaltyPercentage: 15.0,
    startDate: '2023-08-22',
    endDate: '2026-08-22',
    status: 'active' as const,
    totalRevenue: 78456.25,
    isPhysical: false,
    workBilling: 35000,
  },
  {
    id: 3,
    artistName: 'DJ Martina',
    artistPhoto: 'https://images.unsplash.com/photo-1764014353079-08ece464a226?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHByb2R1Y2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxMTk5NTMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Producción Musical',
    royaltyPercentage: 20.0,
    startDate: '2024-03-10',
    endDate: '2025-12-31',
    status: 'active' as const,
    totalRevenue: 32145.80,
    isPhysical: true,
    workBilling: 18000,
  },
  {
    id: 4,
    artistName: 'Miguel Ángel',
    artistPhoto: 'https://images.unsplash.com/photo-1671786390055-13842b30e424?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFydGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTE3NjUwNXww&ixlib=rb-4.1.0&q=80&w=1080',
    contractType: 'Contrato 360°',
    royaltyPercentage: 22.5,
    startDate: '2023-11-05',
    endDate: '2028-11-05',
    status: 'active' as const,
    totalRevenue: 89234.60,
    isPhysical: false,
    workBilling: 42000,
  },
  {
    id: 5,
    artistName: 'Sara Melodías',
    contractType: 'Distribución Digital',
    royaltyPercentage: 12.0,
    startDate: '2023-01-10',
    endDate: '2024-01-10',
    status: 'expired' as const,
    totalRevenue: 28567.40,
    isPhysical: true,
    workBilling: 15000,
  },
  {
    id: 6,
    artistName: 'Pablo Flow',
    contractType: 'Publishing',
    royaltyPercentage: 25.0,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    status: 'pending' as const,
    totalRevenue: 0,
    isPhysical: false,
    workBilling: 8000,
  },
];

export function ContractsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contracts, setContracts] = useState(MOCK_CONTRACTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'pending'>('all');

  // Filtrar contratos por búsqueda y estado
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddContract = (newContract: any) => {
    setContracts([newContract, ...contracts]);
    setShowAddModal(false);
  };

  // Estadísticas rápidas
  const stats = {
    total: contracts.length,
    active: contracts.filter((c) => c.status === 'active').length,
    expired: contracts.filter((c) => c.status === 'expired').length,
    pending: contracts.filter((c) => c.status === 'pending').length,
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
          <FileText size={32} color="#c9a574" />
          Gestión de Contratos
        </h1>
        <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
          Administra los contratos de distribución y royalties de tus artistas
        </p>
      </div>

      {/* Barra de acciones */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          flexWrap: 'wrap',
        }}
      >
        {/* Búsqueda */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div
            style={{
              position: 'relative',
              background: 'rgba(42, 63, 63, 0.4)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <Search
              size={20}
              color="#c9a574"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
            <input
              type="text"
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Filtro de estado */}
        <div style={{ position: 'relative' }}>
          <Filter
            size={18}
            color="#c9a574"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            style={{
              padding: '14px 16px 14px 44px',
              background: 'rgba(42, 63, 63, 0.4)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '14px',
              cursor: 'pointer',
              outline: 'none',
              minWidth: '180px',
            }}
          >
            <option value="all" style={{ background: '#2a3f3f' }}>
              Todos los estados
            </option>
            <option value="active" style={{ background: '#2a3f3f' }}>
              Activos
            </option>
            <option value="pending" style={{ background: '#2a3f3f' }}>
              Pendientes
            </option>
            <option value="expired" style={{ background: '#2a3f3f' }}>
              Expirados
            </option>
          </select>
        </div>

        {/* Botón agregar contrato */}
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 24px',
            background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
            border: 'none',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(201, 165, 116, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.3)';
          }}
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={20} />
          Nuevo Contrato
        </button>
      </div>

      {/* Grid de tarjetas de contratos */}
      {filteredContracts.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onClick={() => console.log('Ver detalles del contrato', contract.id)}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.2)',
            borderRadius: '20px',
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <Search size={48} color="#c9a574" style={{ margin: '0 auto 20px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
            No se encontraron contratos
          </h3>
          <p style={{ fontSize: '14px', color: '#AFB3B7' }}>
            Intenta con otros términos de búsqueda o ajusta los filtros
          </p>
        </div>
      )}

      {/* Modal para agregar contrato */}
      <AddContractModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddContract}
      />
    </div>
  );
}