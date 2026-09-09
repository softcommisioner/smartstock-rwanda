export const flutterwaveService = {
  processPayment: async (paymentDetails: any) => {
    console.log("Bypassing payment for beta users...", paymentDetails);
    // Hitamo ko transaction yabaye successful atahakoreshejwe portal
    return {
      status: "successful",
      tx_ref: `BETA-FREE-${Date.now()}`,
      transaction_id: `FREE-${Math.floor(Math.random() * 1000000)}`
    };
  }
};

export default flutterwaveService;