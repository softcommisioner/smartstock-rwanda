export const smsService = {
  // Method yo koherereza WhatsApp
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

  // Method za logs zo gukingira crash
  getLogs() {
    try {
      const logs = localStorage.getItem('smartstock_sms_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  },

  // Method yo koherereza OTP ku Email ikoresheje Resend API
  async sendOTP(emailOrPhone: string, code: string) {
    const apiKey = (import.meta as any).env?.VITE_RESEND_API_KEY;

    if (emailOrPhone.includes('@') && apiKey) {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            from: 'SmartStock <onboarding@resend.dev>',
            to: [emailOrPhone],
            subject: 'SmartStock Rwanda Verification Code',
            html: `<div style="font-family: Arial; padding: 20px;">
                    <h2>SmartStock Rwanda Security</h2>
                    <p>Ikode yawe yo kwinjira ni:</p>
                    <h1 style="color: #10B981; letter-spacing: 4px;">${code}</h1>
                   </div>`
          }),
        });
        
        if (response.ok) return { success: true };
      } catch (err) {
        console.error("Resend send error:", err);
      }
    }

    // Fallback niba ari WhatsApp cyangwa niba API key itarasomwa
    return this.sendSMS(emailOrPhone, `Your SmartStock Rwandan verification OTP is: ${code}`);
  },

  async sendReceiptAlert(phoneNumber: string, amount: number, transactionId: string) {
    return this.sendSMS(phoneNumber, `SmartStock Receipt: Payment of ${amount} RWF received. TxID: ${transactionId}`);
  }
};

export const SMSService = smsService;
export default smsService;