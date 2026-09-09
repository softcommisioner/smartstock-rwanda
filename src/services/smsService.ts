export const sendDirectSMS = async (phoneNumber: string, messageText: string) => {
  try {
    const token = (import.meta as any).env?.VITE_SMS_API_TOKEN || "";

    if (!token) {
      console.log("[SIMULATED SMS to " + phoneNumber + "]: " + messageText);
      return { success: true, simulated: true };
    }

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
};

export const sendWhatsAppNotification = async (phoneNumber: string, messageText: string) => {
  try {
    const apiUrl = (import.meta as any).env?.VITE_WHATSAPP_API_URL || "https://api.manychat.com/fb/sending/sendContent";
    const token = (import.meta as any).env?.VITE_WHATSAPP_TOKEN || "";

    if (!token) {
      console.log("[SIMULATED WHATSAPP to " + phoneNumber + "]: " + messageText);
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
};

export const sendOTP = async (phoneNumber: string, code: string) => {
  const msg = "SmartStock Rwanda: Ikode yawe yo kwinjira mu buryo bw'umutekano ni " + code + ". Ntiyisangize undi muntu.";
  return sendDirectSMS(phoneNumber, msg);
};

export const sendDailyReport = async (ownerPhone: string, summaryText: string) => {
  const msg = "Mwiriwe ho! Igihe cyo kureba raporo y'ubucuruzi bwawe ni iki muri SmartStock.\n\n" + summaryText + "\n\nInganji kuri AI system cyangwa ugenzure mu nzira zisanzwe.";
  return sendWhatsAppNotification(ownerPhone, msg);
};

export const sendCustomerInvoice = async (customerPhone: string, invoiceDetails: string) => {
  const msg = "Mwiriwe! Urakoze kugura muri SmartStock. Facture yawe:\n" + invoiceDetails;
  return sendWhatsAppNotification(customerPhone, msg);
};

export const sendStockUpdateAlert = async (cashierPhone: string, itemName: string, quantity: number) => {
  const msg = "SmartStock Alert: Hari ibicuruzwa bishya byongewe muri Stock (" + itemName + ": +" + quantity + ").";
  return sendWhatsAppNotification(cashierPhone, msg);
};

export const getLogs = () => {
  try {
    const logs = localStorage.getItem('smartstock_sms_logs');
    return logs ? JSON.parse(logs) : [];
  } catch {
    return [];
  }
};

export const sendSMS = sendDirectSMS;
export const sendReceiptAlert = async (phoneNumber: string, amount: number, transactionId: string) => {
  return sendDirectSMS(phoneNumber, "SmartStock Receipt: Payment of " + amount + " RWF received. TxID: " + transactionId);
};

export const smsService = {
  sendDirectSMS,
  sendWhatsAppNotification,
  sendOTP,
  sendDailyReport,
  sendCustomerInvoice,
  sendStockUpdateAlert,
  getLogs,
  sendSMS,
  sendReceiptAlert
};

export const SMSService = smsService;
export default smsService;