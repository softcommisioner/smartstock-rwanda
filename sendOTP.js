import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

// Setup SMTP Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to Send OTP Email
async function sendOTP(toEmail, otpCode) {
  const mailOptions = {
    from: `"SmartStock AI" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `${otpCode} - SmartStock AI Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 500px;">
        <h2 style="color: #2563eb;">SmartStock AI</h2>
        <p>Ikode yawe yo kwemeza kwinjira ni:</p>
        <h1 style="color: #0f172a; letter-spacing: 5px; background: #f1f5f9; padding: 10px; text-align: center; border-radius: 5px;">${otpCode}</h1>
        <p style="color: #64748b; font-size: 12px;">Iyi kode irata agaciro nyuma y'iminota 10.</p>
      </div>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('OTP Yagiye neza! Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('Ikosa mu koherereza:', error);
    return false;
  }
}

// Test Send
const code = Math.floor(100000 + Math.random() * 900000);
sendOTP('ntagerereranwakevin@gmail.com', code);