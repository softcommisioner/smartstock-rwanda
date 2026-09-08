export const smsService = {
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
  }
};

export const SMSService = smsService;