import { useState } from 'react';
import { ArrowDownRight, Plus, Trash2, Edit, Download, Filter, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpensesSectionProps {
  dashboardData: any;
  artists: any[];
}

export function ExpensesSection({ dashboardData, artists }: ExpensesSectionProps) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      category: 'operativo',
      concept: 'Servidor Cloud',
      description: 'Hosting mensual',
      amount: 150.00,
      date: '2026-02-01',
      provider: 'AWS',
      invoiceNumber: 'INV-2026-001',
      paymentMethod: 'tarjeta'
    },
    {
      id: 2,
      category: 'marketing',
      concept: 'Campaña Digital',
      description: 'Ads en redes sociales',
      amount: 500.00,
      date: '2026-02-05',
      provider: 'Meta Ads',
      invoiceNumber: 'INV-2026-002',
      paymentMethod: 'tarjeta'
    },
    {
      id: 3,
      category: 'distribucion',
      concept: 'The Orchard',
      description: 'Comisión distribución',
      amount: 300.00,
      date: '2026-02-10',
      provider: 'The Orchard',
      invoiceNumber: 'INV-2026-003',
      paymentMethod: 'transferencia'
    },
    {
      id: 4,
      category: 'legal',
      concept: 'Asesoría Legal',
      description: 'Revisión de contratos',
      amount: 800.00,
      date: '2026-02-12',
      provider: 'Bufete García',
      invoiceNumber: 'INV-2026-004',
      paymentMethod: 'transferencia'
    }
  ]);

  const [newExpense, setNewExpense] = useState({
    category: 'operativo',
    concept: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    provider: '',
    invoiceNumber: '',
    paymentMethod: 'transferencia'
  });

  const categoryColors: { [key: string]: string } = {
    operativo: '#60a5fa',
    marketing: '#f59e0b',
    distribucion: '#8b5cf6',
    legal: '#ef4444',
    otros: '#6b7280'
  };

  const categoryLabels: { [key: string]: string } = {
    operativo: 'Operativo',
    marketing: 'Marketing',
    distribucion: 'Distribución',
    legal: 'Legal',
    otros: 'Otros'
  };

  // Calcular totales por categoría
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as { [key: string]: number });

  const categoryChartData = Object.keys(expensesByCategory).map(category => ({
    name: categoryLabels[category] || category,
    value: expensesByCategory[category],
    color: categoryColors[category]
  }));

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const handleAddExpense = () => {
    if (!newExpense.concept || !newExpense.amount) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    const expense = {
      id: expenses.length + 1,
      category: newExpense.category,
      concept: newExpense.concept,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date,
      provider: newExpense.provider,
      invoiceNumber: newExpense.invoiceNumber,
      paymentMethod: newExpense.paymentMethod
    };

    setExpenses([...expenses, expense]);
    setShowAddExpense(false);
    setNewExpense({
      category: 'operativo',
      concept: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      provider: '',
      invoiceNumber: '',
      paymentMethod: 'transferencia'
    });
  };

  const handleDeleteExpense = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este gasto?')) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  return (
    <div>
      {/* Header Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Total Gastos */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ArrowDownRight size={24} color="#ef4444" />
            </div>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Total Gastos
            </span>
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#ef4444',
            marginBottom: '8px'
          }}>
            €{totalExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {expenses.length} gastos registrados
          </div>
        </div>

        {/* Operativo */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(96, 165, 250, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Operativo
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#60a5fa',
            marginBottom: '8px'
          }}>
            €{(expensesByCategory.operativo || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {((expensesByCategory.operativo || 0) / totalExpenses * 100).toFixed(1)}% del total
          </div>
        </div>

        {/* Marketing */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Marketing
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#f59e0b',
            marginBottom: '8px'
          }}>
            €{(expensesByCategory.marketing || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {((expensesByCategory.marketing || 0) / totalExpenses * 100).toFixed(1)}% del total
          </div>
        </div>

        {/* Distribución */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.4)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(139, 92, 246, 0.3)'
        }}>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Distribución
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#8b5cf6',
            marginBottom: '8px'
          }}>
            €{(expensesByCategory.distribucion || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.5)' }}>
            {((expensesByCategory.distribucion || 0) / totalExpenses * 100).toFixed(1)}% del total
          </div>
        </div>
      </div>

      {/* Gráfico y Botón Agregar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Gráfico de Gastos por Categoría */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid rgba(201, 165, 116, 0.2)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            Gastos por Categoría
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255, 255, 255, 0.6)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="rgba(255, 255, 255, 0.6)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `€${value}`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(42, 63, 63, 0.95)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  formatter={(value: any) => [`€${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`, '']}
                  labelStyle={{ color: '#c9a574' }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[8, 8, 0, 0]}>
                  {categoryChartData.map((entry, index) => (
                    <rect key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Botón Agregar Gasto */}
        <div style={{
          background: 'rgba(42, 63, 63, 0.3)',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px'
        }}>
          <Plus size={48} color="#c9a574" style={{ opacity: 0.5 }} />
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center'
          }}>
            Registrar Nuevo Gasto
          </h3>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            Añade un nuevo gasto operativo, de marketing, distribución o legal
          </p>
          <button
            onClick={() => setShowAddExpense(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #c9a574 0%, #b8935d 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#2a3f3f',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)'
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
            <Plus size={18} />
            Agregar Gasto
          </button>
        </div>
      </div>

      {/* Modal Agregar Gasto */}
      {showAddExpense && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.95) 0%, rgba(30, 47, 47, 0.95) 100%)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '24px'
            }}>
              Registrar Nuevo Gasto
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Categoría */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px'
                }}>
                  Categoría *
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  <option value="operativo">Operativo</option>
                  <option value="marketing">Marketing</option>
                  <option value="distribucion">Distribución</option>
                  <option value="legal">Legal</option>
                  <option value="otros">Otros</option>
                </select>
              </div>

              {/* Concepto */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px'
                }}>
                  Concepto *
                </label>
                <input
                  type="text"
                  value={newExpense.concept}
                  onChange={(e) => setNewExpense({ ...newExpense, concept: e.target.value })}
                  placeholder="Ej: Servidor Cloud"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Descripción */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px'
                }}>
                  Descripción
                </label>
                <textarea
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="Detalles adicionales..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Monto y Fecha */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#c9a574',
                    marginBottom: '8px'
                  }}>
                    Monto (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    placeholder="0.00"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#c9a574',
                    marginBottom: '8px'
                  }}>
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Proveedor y Número de Factura */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#c9a574',
                    marginBottom: '8px'
                  }}>
                    Proveedor
                  </label>
                  <input
                    type="text"
                    value={newExpense.provider}
                    onChange={(e) => setNewExpense({ ...newExpense, provider: e.target.value })}
                    placeholder="Nombre del proveedor"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#c9a574',
                    marginBottom: '8px'
                  }}>
                    Nº Factura
                  </label>
                  <input
                    type="text"
                    value={newExpense.invoiceNumber}
                    onChange={(e) => setNewExpense({ ...newExpense, invoiceNumber: e.target.value })}
                    placeholder="INV-2026-XXX"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(201, 165, 116, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#c9a574',
                  marginBottom: '8px'
                }}>
                  Método de Pago
                </label>
                <select
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(201, 165, 116, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    fontSize: '14px'
                  }}
                >
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            {/* Botones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px'
            }}>
              <button
                onClick={() => setShowAddExpense(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddExpense}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #c9a574 0%, #b8935d 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#2a3f3f',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(201, 165, 116, 0.3)'
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
                Guardar Gasto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Gastos */}
      <div style={{
        background: 'rgba(42, 63, 63, 0.3)',
        borderRadius: '16px',
        border: '1px solid rgba(201, 165, 116, 0.2)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            margin: 0
          }}>
            Historial de Gastos
          </h3>
          <button
            onClick={() => alert('Exportando a Excel...')}
            style={{
              padding: '8px 16px',
              background: 'rgba(201, 165, 116, 0.1)',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderRadius: '8px',
              color: '#c9a574',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
            }}
          >
            <Download size={14} />
            Exportar
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                background: 'rgba(0, 0, 0, 0.2)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Fecha
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Concepto
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Categoría
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Proveedor
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'right',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Monto
                </th>
                <th style={{
                  padding: '16px 24px',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#c9a574',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr
                  key={expense.id}
                  style={{
                    borderBottom: index < expenses.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(201, 165, 116, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    {new Date(expense.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{
                    padding: '20px 24px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#ffffff',
                      marginBottom: '4px'
                    }}>
                      {expense.concept}
                    </div>
                    {expense.description && (
                      <div style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.5)'
                      }}>
                        {expense.description}
                      </div>
                    )}
                  </td>
                  <td style={{
                    padding: '20px 24px'
                  }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      background: `${categoryColors[expense.category]}20`,
                      color: categoryColors[expense.category],
                      border: `1px solid ${categoryColors[expense.category]}40`
                    }}>
                      {categoryLabels[expense.category]}
                    </span>
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    {expense.provider || '-'}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    textAlign: 'right',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#ef4444'
                  }}>
                    €{expense.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{
                    padding: '20px 24px',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        style={{
                          padding: '6px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '6px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
