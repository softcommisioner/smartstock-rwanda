export interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
}

export const generateTxRef = (prefix = 'SMARTSTOCK'): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

export const getFlutterwaveConfig = (
  amount: number,
  customerEmail: string,
  customerPhone: string,
  customerName: string,
  txRef?: string
): FlutterwaveConfig => {
  const publicKey = (import.meta as any).env?.VITE_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-DEFAULT';
  
  return {
    public_key: publicKey,
    tx_ref: txRef || generateTxRef(),
    amount,
    currency: 'RWF',
    payment_options: 'card,mobilemoneyrwanda',
    customer: {
      email: customerEmail || 'customer@smartstock.rw',
      phone_number: customerPhone,
      name: customerName || 'SmartStock Customer',
    },
    customizations: {
      title: 'SmartStock Payment',
      description: 'Payment for stock purchase',
      logo: 'https://smartstock.rw/logo.png',
    },
  };
};

export const buildFlutterwavePayload = getFlutterwaveConfig;

export const loadFlutterwaveScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).FlutterwaveCheckout) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processSuccessfulPayment = async (response: any) => {
  console.log("Payment successful response:", response);
  return {
    success: true,
    transactionId: response.transaction_id || response.tx_ref,
    data: response
  };
};

export const flutterwaveService = {
  generateTxRef,
  getFlutterwaveConfig,
  buildFlutterwavePayload,
  loadFlutterwaveScript,
  processSuccessfulPayment
};

export default flutterwaveService;