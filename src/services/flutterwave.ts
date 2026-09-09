// Subiza ibyizeremwe byose ngo Vite/Rollup irize build
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
  return true; // Fake script load success
};

export const flutterwaveService = {
  processPayment: async (paymentDetails: any) => {
    console.log("Bypassing Flutterwave payment for beta testing...");
    return {
      status: "successful",
      tx_ref: `BETA-FREE-${Date.now()}`,
      transaction_id: `FREE-${Math.floor(Math.random() * 1000000)}`
    };
  }
};

export default flutterwaveService;