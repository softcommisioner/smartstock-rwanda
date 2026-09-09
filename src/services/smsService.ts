export const smsService = {
  // 1. Mobile Direct SMS via Pindo.io (SMS yo kuri Telefone - OTP)
  async sendDirectSMS(phoneNumber: string, messageText: string) {
    try {
      const token = (import.meta as any).env?.VITE_SMS_API_TOKEN || "";

      if (!token) {
        console.log(`[SIMULATED SMS to ${phoneNumber}]: ${messageText}`);
        return { success: true, simulated: true };
      }

      // Format Rwanda Phone Number (+25078XXXXXXX)
      let formattedPhone = phoneNumber.trim().replace(/\s+/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+250' + formattedPhone.slice(1);
      } else if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone;
      }

      const response = await fetch("https://api.pindo.io/v1/sms", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          to: formattedPhone,
          text: messageText,
          sender: "SmartStock"
        }),
      });

      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      console.error("Pindo SMS Error:", error);
      return { success: false, error };
    }
  },

  // 2. Send WhatsApp Notification (Invoices, Daily Reports, Cashier Alerts)
  async sendWhatsAppNotification(phoneNumber: string, messageText: string) {
    try {
      const apiUrl = (import.meta as any).env?.VITE_WHATSAPP_API_URL || "https://api.manychat.com/fb/sending/sendContent";
      const token = (import.meta as any).env?.VITE_WHATSAPP_TOKEN || "";

      if (!token) {
        console.log(`[SIMULATED WHATSAPP to ${phoneNumber}]: ${messageText}`);
        return { success: true, simulated: true };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          subscriber_id: phoneNumber,
          data: { message: messageText }
        }),
      });

      return await response.json();
    } catch (error) {
      console.error("WhatsApp Notification Error:", error);
      return { success: false, error };
    }
  },

  // 3. Dispatch OTP Code via Mobile SMS
  async sendOTP(phoneNumber: string, code: string) {
    const msg = `SmartStock Rwanda: Ikode yawe yo kwinjira mu buryo bw'umutekano ni ${code}. Ntiyisangize undi muntu.`;
    return this.sendDirectSMS(phoneNumber, msg);
  },

  // 4. Daily Business Report via WhatsApp (To Owner)
  async sendDailyReport(ownerPhone: string, summaryText: string) {
    const msg = `Mwiriwe ho! Igihe cyo kureba raporo y'ubucuruzi bwawe ni iki muri SmartStock.\n\n${summaryText}\n\nInganji kuri AI system cyangwa ugenzure mu nzira zisanzwe.`;
    return this.sendWhatsAppNotification(ownerPhone, msg);
  },

  // 5. Automatic Customer Invoice via WhatsApp
  async sendCustomerInvoice(customerPhone: string, invoiceDetails: string) {
    const msg = `Mwiriwe! Urakoze kugura muri SmartStock. Facture yawe:\n${invoiceDetails}`;
    return this.sendWhatsAppNotification(customerPhone, msg);
  },

  // 6. Cashier Stock Alert via WhatsApp
  async sendStockUpdateAlert(cashierPhone: string, itemName: string, quantity: number) {
    const msg = `SmartStock Alert: Hari ibicuruzwa bishya byongewe muri Stock (${itemName}: +${quantity}).`;
    return this.sendWhatsAppNotification(cashierPhone, msg);
  },

  getLogs() {
    try {
      const logs = localStorage.getItem('smartstock_sms_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }
};

export const SMSService = smsService;
export default smsService;