import { X, FileText, User, Percent, Calendar, FileSignature, FileCheck, Euro } from 'lucide-react';
import { useState } from 'react';

interface AddContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: any) => void;
}

export function AddContractModal({ isOpen, onClose, onSave }: AddContractModalProps) {
  const [formData, setFormData] = useState({
    artistName: '',
    artistPhoto: '',
    contractType: '',
    royaltyPercentage: '',
    startDate: '',
    endDate: '',
    status: 'active' as 'active' | 'expired' | 'pending',
    isPhysical: false,
    workBilling: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const contractTypes = [
    'Contrato 360°',
    'Distribución Digital',
    'Producción Musical',
    'Licencia de Uso',
    'Publishing',
    'Management',
  ];

  if (!isOpen) return null;

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.artistName.trim()) {
      newErrors.artistName = 'El nombre del artista es obligatorio';
    }

    if (!formData.contractType) {
      newErrors.contractType = 'Selecciona un tipo de contrato';
    }

    if (!formData.royaltyPercentage) {
      newErrors.royaltyPercentage = 'El porcentaje es obligatorio';
    } else {
      const percentage = parseFloat(formData.royaltyPercentage);
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        newErrors.royaltyPercentage = 'Ingresa un porcentaje válido (0-100)';
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es obligatoria';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de vencimiento es obligatoria';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'La fecha de vencimiento debe ser posterior a la de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newContract = {
      id: Date.now(),
      artistName: formData.artistName,
      artistPhoto: formData.artistPhoto || undefined,
      contractType: formData.contractType,
      royaltyPercentage: parseFloat(formData.royaltyPercentage),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      totalRevenue: 0, // Inicialmente 0
      isPhysical: formData.isPhysical,
      workBilling: formData.workBilling,
    };

    onSave(newContract);

    // Reset form
    setFormData({
      artistName: '',
      artistPhoto: '',
      contractType: '',
      royaltyPercentage: '',
      startDate: '',
      endDate: '',
      status: 'active',
      isPhysical: false,
      workBilling: '',
    });
    setErrors({});
  };

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
        style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.95) 0%, rgba(30, 47, 47, 0.98) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.3)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileSignature size={20} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Nuevo Contrato
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(201, 165, 116, 0.1)',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            <X size={20} color="#c9a574" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Nombre del artista */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px',
                }}
              >
                <User size={16} />
                Nombre del Artista *
              </label>
              <input
                type="text"
                value={formData.artistName}
                onChange={(e) => handleChange('artistName', e.target.value)}
                placeholder="Ej: Luna García"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  border: `1px solid ${errors.artistName ? '#ef4444' : 'rgba(201, 165, 116, 0.3)'}`,
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => {
                  if (!errors.artistName) {
                    e.target.style.borderColor = '#c9a574';
                  }
                }}
                onBlur={(e) => {
                  if (!errors.artistName) {
                    e.target.style.borderColor = 'rgba(201, 165, 116, 0.3)';
                  }
                }}
              />
              {errors.artistName && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                  {errors.artistName}
                </p>
              )}
            </div>

            {/* URL de foto (opcional) */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px',
                }}
              >
                <User size={16} />
                URL de Foto (opcional)
              </label>
              <input
                type="url"
                value={formData.artistPhoto}
                onChange={(e) => handleChange('artistPhoto', e.target.value)}
                placeholder="https://..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Tipo de contrato */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px',
                }}
              >
                <FileText size={16} />
                Tipo de Contrato *
              </label>
              <select
                value={formData.contractType}
                onChange={(e) => handleChange('contractType', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  border: `1px solid ${errors.contractType ? '#ef4444' : 'rgba(201, 165, 116, 0.3)'}`,
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="" style={{ background: '#2a3f3f' }}>
                  Selecciona un tipo
                </option>
                {contractTypes.map((type) => (
                  <option key={type} value={type} style={{ background: '#2a3f3f' }}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.contractType && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                  {errors.contractType}
                </p>
              )}
            </div>

            {/* Porcentaje de royalties */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px',
                }}
              >
                <Percent size={16} />
                Porcentaje de Royalties *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.royaltyPercentage}
                onChange={(e) => handleChange('royaltyPercentage', e.target.value)}
                placeholder="Ej: 15.5"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  border: `1px solid ${errors.royaltyPercentage ? '#ef4444' : 'rgba(201, 165, 116, 0.3)'}`,
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              {errors.royaltyPercentage && (
                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                  {errors.royaltyPercentage}
                </p>
              )}
            </div>

            {/* Fechas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Fecha de inicio */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#c9a574',
                    marginBottom: '8px',
                  }}
                >
                  <Calendar size={16} />
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(42, 63, 63, 0.5)',
                    border: `1px solid ${errors.startDate ? '#ef4444' : 'rgba(201, 165, 116, 0.3)'}`,
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                {errors.startDate && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* Fecha de vencimiento */}
              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#c9a574',
                    marginBottom: '8px',
                  }}
                >
                  <Calendar size={16} />
                  Vencimiento *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(42, 63, 63, 0.5)',
                    border: `1px solid ${errors.endDate ? '#ef4444' : 'rgba(201, 165, 116, 0.3)'}`,
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
                {errors.endDate && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                    {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Estado */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px',
                }}
              >
                <FileSignature size={16} />
                Estado del Contrato
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="active" style={{ background: '#2a3f3f' }}>
                  Activo
                </option>
                <option value="pending" style={{ background: '#2a3f3f' }}>
                  Pendiente
                </option>
                <option value="expired" style={{ background: '#2a3f3f' }}>
                  Expirado
                </option>
              </select>
            </div>

            {/* Facturación de trabajo */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px',
                }}
              >
                <Euro size={16} />
                Facturación de Trabajo
              </label>
              <input
                type="text"
                value={formData.workBilling}
                onChange={(e) => handleChange('workBilling', e.target.value)}
                placeholder="Ej: 1000"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Contrato físico */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#c9a574',
                  cursor: 'pointer',
                  padding: '12px 16px',
                  background: 'rgba(42, 63, 63, 0.5)',
                  border: '1px solid rgba(201, 165, 116, 0.3)',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(42, 63, 63, 0.7)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(42, 63, 63, 0.5)';
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.isPhysical}
                  onChange={(e) => handleChange('isPhysical', e.target.checked)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: '#c9a574',
                  }}
                />
                <FileCheck size={16} />
                <span>Contrato Físico (marcar si es físico, dejar vacío si es digital)</span>
              </label>
            </div>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(201, 165, 116, 0.1)',
                border: '1px solid rgba(201, 165, 116, 0.3)',
                borderRadius: '10px',
                color: '#c9a574',
                fontSize: '14px',
                fontWeight: '600',
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
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #c9a574 0%, #a68a5e 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
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
            >
              Crear Contrato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}