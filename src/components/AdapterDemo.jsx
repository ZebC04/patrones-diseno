import React, { useState } from 'react';
import { PaymentAdapterFactory } from '../patterns/adapter/PaymentAdapter';

const AdapterDemo = () => {
  const [paymentResults, setPaymentResults] = useState([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Estado para formulario de pagos
  const [paymentForm, setPaymentForm] = useState({
    provider: 'paypal',
    email: 'usuario@ejemplo.com',
    amount: 99.99,
    cardToken: '4242424242424242'
  });

  // Función para obtener información del proveedor
  const getProviderInfo = (provider) => {
    const providers = {
      paypal: { name: 'PayPal', fee: '2.9%', currency: 'USD' },
      stripe: { name: 'Stripe', fee: '2.9% + $0.30', currency: 'USD' },
      mercadopago: { name: 'MercadoPago', fee: '3.4%', currency: 'USD' }
    };
    return providers[provider];
  };

  // Procesar pago usando el adapter
  const processPayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      const adapter = PaymentAdapterFactory.createAdapter(paymentForm.provider);
      const result = await adapter.processPayment({
        email: paymentForm.email,
        amount: paymentForm.amount,
        cardToken: paymentForm.cardToken
      });

      const paymentRecord = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        ...result
      };

      setPaymentResults(prev => [paymentRecord, ...prev]);
    } catch (error) {
      const errorRecord = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        success: false,
        error: error.message,
        provider: paymentForm.provider
      };
      setPaymentResults(prev => [errorRecord, ...prev]);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const clearPaymentHistory = () => setPaymentResults([]);

  return (
    <div className="adapter-demo">
      <h2>🔌 Patrón Adapter - Sistema de Pagos</h2>
      <p className="description">
        El patrón Adapter permite que sistemas con interfaces incompatibles trabajen juntos. 
        En este ejemplo, integramos diferentes proveedores de pago con una interfaz unificada.
      </p>

      <div className="demo-section">
        <h3>💳 Sistema de Pagos Unificado</h3>
        <div className="demo-grid">
          {/* Formulario de pagos */}
          <div className="form-section">
            <h4>💰 Procesar Pago</h4>
            <div className="form-group">
              <label>Proveedor de Pago:</label>
              <select
                value={paymentForm.provider}
                onChange={(e) => setPaymentForm(prev => ({...prev, provider: e.target.value}))}
              >
                <option value="paypal">💙 PayPal</option>
                <option value="stripe">💜 Stripe</option>
                <option value="mercadopago">💛 MercadoPago</option>
              </select>
              
              <div className="provider-info">
                {(() => {
                  const info = getProviderInfo(paymentForm.provider);
                  return (
                    <div className="info-card">
                      <strong>📊 {info.name}</strong>
                      <p>💸 Comisión: {info.fee}</p>
                      <p>💰 Moneda: {info.currency}</p>
                    </div>
                  );
                })()}
              </div>

              <label>📧 Email:</label>
              <input
                type="email"
                value={paymentForm.email}
                onChange={(e) => setPaymentForm(prev => ({...prev, email: e.target.value}))}
                placeholder="usuario@ejemplo.com"
              />

              <label>💵 Monto (USD):</label>
              <input
                type="number"
                step="0.01"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm(prev => ({...prev, amount: parseFloat(e.target.value) || 0}))}
                placeholder="99.99"
              />

              <label>💳 Token de Tarjeta:</label>
              <input
                type="text"
                value={paymentForm.cardToken}
                onChange={(e) => setPaymentForm(prev => ({...prev, cardToken: e.target.value}))}
                placeholder="4242424242424242"
              />

              <button 
                onClick={processPayment}
                disabled={isProcessingPayment}
                className="process-btn"
              >
                {isProcessingPayment ? '⏳ Procesando...' : '💳 Procesar Pago'}
              </button>
            </div>
          </div>

          {/* Historial de pagos */}
          <div className="results-section">
            <div className="section-header">
              <h4>📋 Historial de Transacciones ({paymentResults.length})</h4>
              <button onClick={clearPaymentHistory} className="clear-btn">
                🗑️ Limpiar Historial
              </button>
            </div>
            <div className="results-list">
              {paymentResults.map(result => (
                <div key={result.id} className={`result-card ${result.success ? 'success' : 'error'}`}>
                  <div className="result-header">
                    <span className={`status-badge ${result.success ? 'success' : 'error'}`}>
                      {result.success ? '✅ Exitoso' : '❌ Fallido'}
                    </span>
                    <span className="provider-badge">{result.provider}</span>
                    <span className="timestamp">{result.timestamp}</span>
                  </div>
                  <div className="result-details">
                    {result.success ? (
                      <>
                        <p><strong>💰 Monto:</strong> ${result.amount}</p>
                        <p><strong>📧 Email:</strong> {result.userEmail}</p>
                        <p><strong>🆔 ID Transacción:</strong> {result.transactionId}</p>
                        <p><strong>� Comisión:</strong> ${result.fee?.toFixed(2)}</p>
                        {result.cardLast4 && (
                          <p><strong>💳 Tarjeta:</strong> ****{result.cardLast4}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p><strong>❌ Error:</strong> {result.error}</p>
                        <p><strong>🏦 Proveedor:</strong> {result.provider}</p>
                        <p><strong>📧 Email:</strong> {result.userEmail}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {paymentResults.length === 0 && (
                <div className="empty-state">
                  <p>💳 No hay transacciones procesadas.</p>
                  <p>¡Realiza tu primer pago para empezar!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pattern-explanation">
        <h4>💡 ¿Cómo funciona el Patrón Adapter?</h4>
        <div className="explanation-content">
          <div className="explanation-step">
            <h5>🔌 1. Interfaces Incompatibles</h5>
            <p>Cada proveedor (PayPal, Stripe, MercadoPago) tiene su propia API con métodos diferentes.</p>
          </div>
          <div className="explanation-step">
            <h5>🌉 2. El Adapter como Puente</h5>
            <p>Nuestro PaymentAdapter traduce las llamadas a la interfaz específica de cada proveedor.</p>
          </div>
          <div className="explanation-step">
            <h5>⚡ 3. Ventajas del Patrón</h5>
            <p>• Una sola interfaz para múltiples proveedores<br/>
               • Fácil agregar nuevos proveedores<br/>
               • El código cliente no cambia al cambiar de proveedor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdapterDemo;
