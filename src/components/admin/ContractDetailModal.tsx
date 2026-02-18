import { X, FileText, Calendar, TrendingUp, CheckCircle, AlertCircle, Euro, FileCheck } from 'lucide-react';

interface ContractDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any;
}

export function ContractDetailModal({ isOpen, onClose, contract }: ContractDetailModalProps) {
  if (!isOpen || !contract) return null;

  console.log('Modal rendering with contract:', contract);

  const statusConfig: any = {
    active: {
      label: 'Activo',
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.1)',
      icon: CheckCircle,
    },
    expired: {
      label: 'Expirado',
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      icon: AlertCircle,
    },
    pending: {
      label: 'Pendiente',
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      icon: AlertCircle,
    },
  };

  const currentStatus = statusConfig[contract.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
      }).format(amount || 0);
    } catch (e) {
      return `€${(amount || 0).toFixed(2)}`;
    }
  };

  // Valores seguros
  const totalRevenue = Number(contract.totalRevenue) || 0;
  const royaltyPercentage = Number(contract.royaltyPercentage) || 0;
  const workBilling = Number(contract.workBilling) || 0;
  const isPhysical = contract.isPhysical ?? false;

  // Calcular royalty del artista
  const artistRoyalty = (totalRevenue * royaltyPercentage) / 100;
  const labelShare = totalRevenue - artistRoyalty;

  // Calcular días hasta vencimiento
  let daysUntilExpiry = 0;
  try {
    const today = new Date();
    const endDate = new Date(contract.endDate);
    daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  } catch (e) {
    daysUntilExpiry = 0;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #2a3f3f 0%, #1e2f2f 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '24px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '32px',
            borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
            position: 'sticky',
            top: 0,
            background: 'linear-gradient(135deg, #2a3f3f 0%, #1e2f2f 100%)',
            zIndex: 1,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '4px',
                }}
              >
                Resumen del Contrato
              </h2>
              <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '16px' }}>
                Información completa del acuerdo contractual
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {contract.artistPhoto ? (
                  <img
                    src={contract.artistPhoto}
                    alt={contract.artistName || 'Artista'}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #c9a574',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                      {(contract.artistName || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#c9a574' }}>
                    {contract.artistName || 'Artista'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#AFB3B7' }}>
                    ID del Contrato: #{contract.id || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(201, 165, 116, 0.1)',
                border: '1px solid rgba(201, 165, 116, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
              }}
            >
              <X size={20} color="#c9a574" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div style={{ padding: '32px' }}>
          {/* Estado y tipo */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '20px',
                background: currentStatus.bg,
                border: `2px solid ${currentStatus.color}`,
                borderRadius: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <StatusIcon size={24} color={currentStatus.color} />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#AFB3B7' }}>
                  Estado del Contrato
                </span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: currentStatus.color }}>
                {currentStatus.label}
              </div>
              {daysUntilExpiry > 0 && daysUntilExpiry < 90 && (
                <div style={{ fontSize: '12px', color: '#AFB3B7', marginTop: '8px' }}>
                  Vence en {daysUntilExpiry} días
                </div>
              )}
            </div>

            <div
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '20px',
                background: 'rgba(201, 165, 116, 0.1)',
                border: '2px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <FileText size={24} color="#c9a574" />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#AFB3B7' }}>
                  Tipo de Contrato
                </span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                {contract.contractType || 'N/A'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
                <FileCheck size={14} color={isPhysical ? '#c9a574' : '#3b82f6'} />
                <span style={{ fontSize: '12px', color: isPhysical ? '#c9a574' : '#3b82f6' }}>
                  {isPhysical ? 'Físico' : 'Digital'}
                </span>
              </div>
            </div>
          </div>

          {/* Información financiera */}
          <div
            style={{
              background: 'rgba(42, 63, 63, 0.4)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
              Resumen Financiero
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
              {/* Facturación del trabajo */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Euro size={16} color="#c9a574" />
                  <span style={{ fontSize: '12px', color: '#AFB3B7' }}>Facturación Trabajo</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
                  {formatCurrency(workBilling)}
                </div>
              </div>

              {/* Ingresos totales */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={16} color="#c9a574" />
                  <span style={{ fontSize: '12px', color: '#AFB3B7' }}>Ingresos Totales</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#c9a574' }}>
                  {formatCurrency(totalRevenue)}
                </div>
              </div>

              {/* Porcentaje de royalties */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={16} color="#c9a574" />
                  <span style={{ fontSize: '12px', color: '#AFB3B7' }}>% Royalties</span>
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff' }}>
                  {royaltyPercentage}%
                </div>
              </div>

              {/* Royalty del artista */}
              <div>
                <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '8px' }}>
                  Royalty Artista
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>
                  {formatCurrency(artistRoyalty)}
                </div>
              </div>

              {/* Share del label */}
              <div>
                <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '8px' }}>
                  Share del Label
                </div>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>
                  {formatCurrency(labelShare)}
                </div>
              </div>
            </div>
          </div>

          {/* Fechas del contrato */}
          <div
            style={{
              background: 'rgba(42, 63, 63, 0.4)',
              border: '1px solid rgba(201, 165, 116, 0.2)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '20px' }}>
              Período del Contrato
            </h3>

            <div style={{ display: 'grid', gap: '20px' }}>
              {/* Fecha de inicio */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(201, 165, 116, 0.05)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={24} color="#22c55e" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>
                    Fecha de Inicio
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                    {formatDate(contract.startDate)}
                  </div>
                </div>
              </div>

              {/* Fecha de vencimiento */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'rgba(201, 165, 116, 0.05)',
                  borderRadius: '12px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: contract.status === 'expired' 
                      ? 'rgba(239, 68, 68, 0.1)' 
                      : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${contract.status === 'expired' 
                      ? 'rgba(239, 68, 68, 0.3)' 
                      : 'rgba(245, 158, 11, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={24} color={contract.status === 'expired' ? '#ef4444' : '#f59e0b'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>
                    Fecha de Vencimiento
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
                    {formatDate(contract.endDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}