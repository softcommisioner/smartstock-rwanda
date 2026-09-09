// Payload builder for Flutterwave
export const buildFlutterwavePayload = (data: any) => {
  return {
    public_key: (import.meta as any).env?.VITE_FLUTTERWAVE_PUBLIC_KEY || "FLWPUBK_TEST-BETA",
    tx_ref: `BETA-PASS-${Date.now()}`,
    amount: 0,
    currency: "RWF",
    payment_options: "card,mobilemoneyrwanda",
    customer: {
      email: data?.email || "beta@smartstock.rw",
      phone_number: data?.phone || "0780000000",
      name: data?.name || "Beta User",
    },
    customizations: {
      title: "SmartStock Beta Pass",
      description: "Free Registration for Beta Users",
    },
  };
};

export const loadFlutterwaveScript = async (): Promise<boolean> => {
  return true;
};

export const initializePayment = async (data: any) => {
  return { status: "successful", tx_ref: `BETA-FREE-${Date.now()}` };
};

export const verifyTransaction = async (txRef: string) => {
  return { status: "successful", tx_ref: txRef };
};

export const flutterwaveService = {
  processPayment: async (paymentDetails: any) => {
    return {
      status: "successful",
      tx_ref: `BETA-FREE-${Date.now()}`,
      transaction_id: `FREE-${Math.floor(Math.random() * 1000000)}`
    };
  },
  initializePayment,
  verifyTransaction
};

export default flutterwaveService;