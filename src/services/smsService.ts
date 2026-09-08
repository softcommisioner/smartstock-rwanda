export const smsService = {
  // Method yo koherereza ubutumwa bwa WhatsApp/SMS
  async sendSMS(phoneNumber: string, messageText: string) {
    try {
      const apiUrl = (import.meta as any).env?.VITE_WHATSAPP_API_URL || "https://api.manychat.com/fb/sending/sendContent";
      const token = (import.meta as any).env?.VITE_WHATSAPP_TOKEN || "";

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscriber_id: phoneNumber,
          data: { message: messageText }
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("SMS/WhatsApp sending error:", error);
      return { success: false, error };
    }
  },

  // Method za logs izibeshya ko application itagonga crash
  getLogs() {
    try {
      const logs = localStorage.getItem('smartstock_sms_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },

  async sendOTP(emailOrPhone: string, code: string) {
    return this.sendSMS(emailOrPhone, `Your SmartStock Rwandan verification OTP is: ${code}`);
  },

  async sendReceiptAlert(phoneNumber: string, amount: number, transactionId: string) {
    return this.sendSMS(phoneNumber, `SmartStock Receipt: Payment of ${amount} RWF received. TxID: ${transactionId}`);
  }
};

export const SMSService = smsService;
export default smsService;