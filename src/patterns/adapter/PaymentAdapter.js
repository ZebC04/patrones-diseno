// Patrón Adapter para sistemas de pago

// Diferentes proveedores de pago con interfaces incompatibles

// PayPal API (simulada)
class PayPalGateway {
  constructor() {
    this.name = 'PayPal';
  }

  makePayment(email, amount) {
    // Simula procesamiento asíncrono
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% éxito
        resolve({
          paypal_transaction_id: 'PP_' + Math.random().toString(36).substr(2, 9),
          status: success ? 'completed' : 'failed',
          amount_paid: amount,
          user_email: email,
          processing_fee: amount * 0.029
        });
      }, 1000);
    });
  }
}

// Stripe API (simulada)
class StripeProcessor {
  constructor() {
    this.service = 'Stripe';
  }

  processCharge(cardToken, cents) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.05; // 95% éxito
        resolve({
          charge_id: 'ch_' + Math.random().toString(36).substr(2, 12),
          outcome: success ? 'succeeded' : 'declined',
          amount_charged: cents,
          card_last4: cardToken.slice(-4),
          fee_amount: Math.round(cents * 0.029 + 30)
        });
      }, 800);
    });
  }
}

// MercadoPago API (simulada)
class MercadoPagoAPI {
  constructor() {
    this.platform = 'MercadoPago';
  }

  crearPago(datosPago) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.08; // 92% éxito
        resolve({
          id_pago: 'MP_' + Math.random().toString(36).substr(2, 10),
          estado: success ? 'aprobado' : 'rechazado',
          monto_total: datosPago.monto,
          email_comprador: datosPago.email,
          comision: datosPago.monto * 0.035
        });
      }, 1200);
    });
  }
}

// Interface unificada que queremos usar
class PaymentAdapter {
  constructor(provider, providerInstance) {
    this.provider = provider;
    this.gateway = providerInstance;
  }

  async processPayment(paymentData) {
    const { email, amount, cardToken } = paymentData;

    try {
      let result;

      switch (this.provider) {
        case 'paypal':
          result = await this.gateway.makePayment(email, amount);
          return this.normalizePayPalResponse(result);

        case 'stripe':
          const cents = Math.round(amount * 100); // Stripe usa centavos
          result = await this.gateway.processCharge(cardToken || '4242424242424242', cents);
          return this.normalizeStripeResponse(result, email);

        case 'mercadopago':
          result = await this.gateway.crearPago({
            email: email,
            monto: amount,
            token_tarjeta: cardToken
          });
          return this.normalizeMercadoPagoResponse(result);

        default:
          throw new Error(`Proveedor no soportado: ${this.provider}`);
      }
    } catch (error) {
      return {
        success: false,
        transactionId: null,
        amount: amount,
        fee: 0,
        userEmail: email,
        provider: this.provider,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Métodos para normalizar las respuestas a un formato común
  normalizePayPalResponse(response) {
    return {
      success: response.status === 'completed',
      transactionId: response.paypal_transaction_id,
      amount: response.amount_paid,
      fee: response.processing_fee,
      userEmail: response.user_email,
      provider: 'PayPal',
      timestamp: new Date().toISOString(),
      message: response.status === 'completed' ? 'Pago procesado exitosamente' : 'Pago fallido',
      rawResponse: response
    };
  }

  normalizeStripeResponse(response, email) {
    return {
      success: response.outcome === 'succeeded',
      transactionId: response.charge_id,
      amount: response.amount_charged / 100, // Convertir de centavos
      fee: response.fee_amount / 100,
      userEmail: email,
      provider: 'Stripe',
      cardLast4: response.card_last4,
      timestamp: new Date().toISOString(),
      message: response.outcome === 'succeeded' ? 'Cargo procesado exitosamente' : 'Cargo declinado',
      rawResponse: response
    };
  }

  normalizeMercadoPagoResponse(response) {
    return {
      success: response.estado === 'aprobado',
      transactionId: response.id_pago,
      amount: response.monto_total,
      fee: response.comision,
      userEmail: response.email_comprador,
      provider: 'MercadoPago',
      timestamp: new Date().toISOString(),
      message: response.estado === 'aprobado' ? 'Pago aprobado exitosamente' : 'Pago rechazado',
      rawResponse: response
    };
  }

  getProviderInfo() {
    const info = {
      paypal: { name: 'PayPal', fee: '2.9%', currency: 'USD' },
      stripe: { name: 'Stripe', fee: '2.9% + $0.30', currency: 'USD' },
      mercadopago: { name: 'MercadoPago', fee: '3.5%', currency: 'USD/ARS' }
    };

    return info[this.provider] || { name: 'Desconocido', fee: 'N/A', currency: 'N/A' };
  }
}

// Factory para crear adaptadores
class PaymentAdapterFactory {
  static createAdapter(provider) {
    switch (provider.toLowerCase()) {
      case 'paypal':
        return new PaymentAdapter('paypal', new PayPalGateway());
      
      case 'stripe':
        return new PaymentAdapter('stripe', new StripeProcessor());
      
      case 'mercadopago':
        return new PaymentAdapter('mercadopago', new MercadoPagoAPI());
      
      default:
        throw new Error(`Proveedor de pago no soportado: ${provider}`);
    }
  }

  static getSupportedProviders() {
    return ['paypal', 'stripe', 'mercadopago'];
  }
}

export { PaymentAdapter, PaymentAdapterFactory };
