import { FlutterwaveCallbackResponse, FlutterwaveConfig, FlutterwavePaymentPayload, User, OnboardingRegistration } from '../types';
import { db } from './db';

declare global {
  interface Window {
    FlutterwaveCheckout?: (payload: FlutterwavePaymentPayload) => void;
  }
}

/**
 * 1. DYNAMIC FLUTTERWAVE CONFIGURATION:
 * Reads from environment variables (NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY or VITE_FLUTTERWAVE_PUBLIC_KEY)
 * Supports dynamic switching between Test Mode and Live Mode.
 */
export function getFlutterwaveConfig(): FlutterwaveConfig {
  let rawPublicKey = '';
  let rawMode = '';

  // Check Vite client-side import.meta.env
  const meta = import.meta as any;
  if (typeof meta !== 'undefined' && meta?.env) {
    rawPublicKey = 
      meta.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 
      meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 
      '';
    rawMode = 
      meta.env.NEXT_PUBLIC_FLUTTERWAVE_MODE || 
      meta.env.VITE_FLUTTERWAVE_MODE || 
      '';
  }

  // Check Node/process.env fallback if available
  if (!rawPublicKey && typeof process !== 'undefined' && process.env) {
    rawPublicKey = 
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 
      process.env.VITE_FLUTTERWAVE_PUBLIC_KEY || 
      '';
    rawMode = 
      process.env.NEXT_PUBLIC_FLUTTERWAVE_MODE || 
      process.env.VITE_FLUTTERWAVE_MODE || 
      '';
  }

  // Default fallback sandbox key for Rwanda mobile money testing
  if (!rawPublicKey) {
    rawPublicKey = 'FLWPUBK_TEST-sandbox-smartstock-rw-testkey';
  }

  // Determine mode: live if explicitly configured or using live production key
  const isExplicitLive = rawMode.toLowerCase() === 'live';
  const isKeyLive = rawPublicKey.startsWith('FLWPUBK-') && !rawPublicKey.includes('TEST');
  const mode: 'test' | 'live' = (isExplicitLive || isKeyLive) ? 'live' : 'test';

  return {
    publicKey: rawPublicKey,
    mode,
    currency: 'RWF',
    paymentOptions: 'mobilemoneyrwanda,card'
  };
}

/**
 * Generates a unique transaction reference formatted for Rwandan merchants.
 */
export function generateTxRef(prefix = 'SMARTSTOCK-RW'): string {
  const timestamp = Date.now();
  const randomSalt = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}-${timestamp}-${randomSalt}`;
}

/**
 * 2. MOBILE MONEY RWF PAYLOAD STRUCTURE:
 * - Currency: RWF
 * - Payment Options: 'mobilemoneyrwanda', 'card'
 * - Customizations: Title "SmartStock Rwanda", Description "Subscription Payment"
 */
export function buildFlutterwavePayload(options: {
  amountRwf: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  txRef?: string;
  customDescription?: string;
  onSuccess: (response: FlutterwaveCallbackResponse) => void;
  onClose?: () => void;
}): FlutterwavePaymentPayload {
  const config = getFlutterwaveConfig();
  const tx_ref = options.txRef || generateTxRef();

  // Normalize phone number for Rwanda MTN / Airtel MoMo (e.g., +250 78x xxx xxx)
  let cleanPhone = options.customerPhone.trim();
  if (cleanPhone.startsWith('07')) {
    cleanPhone = '+250' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('+') && cleanPhone.startsWith('250')) {
    cleanPhone = '+' + cleanPhone;
  } else if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+250' + cleanPhone;
  }

  return {
    public_key: config.publicKey,
    tx_ref,
    amount: options.amountRwf,
    currency: 'RWF',
    payment_options: 'mobilemoneyrwanda,card',
    customer: {
      email: options.customerEmail.trim() || 'merchant@smartstock.rw',
      phone_number: cleanPhone,
      name: options.customerName.trim() || 'SmartStock Merchant'
    },
    customizations: {
      title: 'SmartStock Rwanda',
      description: options.customDescription || 'Subscription Payment',
      logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=128&auto=format&fit=crop'
    },
    callback: (response: FlutterwaveCallbackResponse) => {
      options.onSuccess(response);
    },
    onclose: () => {
      if (options.onClose) {
        options.onClose();
      }
    }
  };
}

/**
 * Asynchronously loads Flutterwave checkout v3 script with safe error boundary.
 */
export function loadFlutterwaveScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.FlutterwaveCheckout) {
      resolve(true);
      return;
    }

    const scriptId = 'flutterwave-checkout-v3';
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Flutterwave external CDN failed to load; using inline fallback simulator.');
      resolve(false);
    };

    document.head.appendChild(script);
  });
}

/**
 * 3. SUCCESS CALLBACK & DATABASE WEBHOOK HANDLER:
 * Upon successful payment verification callback (`response.status === 'successful'`):
 * - Trigger subscriber account activation.
 * - Clear any temporary demo mode restrictions for that user account.
 * - Return the activated User and Onboarding record for seamless redirection.
 */
export function processSuccessfulPayment(params: {
  response: FlutterwaveCallbackResponse;
  user?: User;
  shopName?: string;
  amountRwf: number;
}): { success: boolean; user: User; onboarding?: OnboardingRegistration } {
  const { response, user, shopName, amountRwf } = params;

  if (response.status !== 'successful') {
    throw new Error(`Flutterwave payment failed with status: ${response.status}`);
  }

  // Activate subscriber account & clear demo mode restrictions
  const result = db.activateSubscriberAccount({
    userId: user?.id,
    txRef: response.tx_ref,
    transactionId: response.transaction_id,
    amountRwf,
    paymentMethod: 'FLUTTERWAVE',
    customerName: response.customer?.name || user?.name,
    customerPhone: response.customer?.phone_number || user?.phone,
    customerEmail: response.customer?.email || user?.email,
    shopName: shopName || user?.shopName
  });

  return {
    success: true,
    user: result.user,
    onboarding: result.onboarding
  };
}
