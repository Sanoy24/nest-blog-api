import nodemailer from 'nodemailer';
import { type SentMessageInfo } from 'nodemailer/lib/smtp-transport';

export async function sendMail(to: string, token: string): Promise<string> {
  try {
    // 1️⃣ Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // 2️⃣ Construct email content
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.MAIL_FROM || '"No Reply" <no-reply@example.com>',
      to,
      subject: 'Verify Your Email Address',
      html: `
        <h2>Email Verification</h2>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}" target="_blank" 
          style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Verify Email
        </a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // 3️⃣ Send the email
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    return info.response;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Email sending failed');
  }
}
