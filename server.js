import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Enable CORS & JSON Request Parsing
app.use(cors());
app.use(express.json());

// Temporary In-Memory Database to store OTPs (In production, use Redis or Database)
const otpStore = new Map();

// Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ROUTE 1: SEND OTP
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email irakenewe!' });
  }

  // Generate 6-digit OTP Code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP with expiration (10 minutes)
  otpStore.set(email, {
    code: otpCode,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
  });

  const mailOptions = {
    from: `"SmartStock AI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${otpCode} - SmartStock AI Verification Code`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 500px;">
        <h2 style="color: #2563eb;">SmartStock AI</h2>
        <p>Ikode yawe yo kwemeza kwinjira ni:</p>
        <h1 style="color: #0f172a; letter-spacing: 5px; background: #f1f5f9; padding: 12px; text-align: center; border-radius: 6px;">${otpCode}</h1>
        <p style="color: #64748b; font-size: 12px;">Iyi kode irata agaciro nyuma y'iminota 10.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'OTP yagiye kuri email neza!' });
  } catch (error) {
    console.error('Ikosa rya OTP:', error);
    return res.status(500).json({ success: false, message: 'Harimo ikosa mu koherereza email.' });
  }
});

// ROUTE 2: VERIFY OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email n\'ikode ya OTP birakenewe!' });
  }

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ success: false, message: 'Nta ikode ya OTP yasabwe kuri iyi email!' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'Iyi ikode ya OTP yarengeje igihe (Expired)!' });
  }

  if (record.code !== otp) {
    return res.status(400).json({ success: false, message: 'Ikode ya OTP ntimaze kumpuzwa (Invalid OTP)!' });
  }

  // Clear OTP after successful verification
  otpStore.delete(email);
  return res.status(200).json({ success: true, message: 'OTP yemerewe neza! Murakaza neza.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 SmartStock AI Server irakora kuri http://localhost:${PORT}`));