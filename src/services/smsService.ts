// Service y'Ubutumwa bwa WhatsApp ikoresha Manychat API
export const sendWhatsAppNotification = async (phoneNumber: string, messageText: string) => {
  try {
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+250${phoneNumber.slice(-9)}`;

    const response = await fetch(import.meta.env.VITE_WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriber_id: formattedPhone,
        data: {
          version: "v2",
          content: {
            messages: [{ type: "text", text: messageText }]
          }
        }
      })
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Manychat WhatsApp Delivery Error:", error);
    return { success: false, error };
  }
};