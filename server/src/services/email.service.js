import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;

function getTransporter() {
  if (!env.smtp.host) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
      tls: {
        rejectUnauthorized: env.smtp.tlsRejectUnauthorized,
      },
    });
  }
  return transporter;
}

export async function sendRegistrationConfirmation({ to, name, eventTitle, eventDate, location }) {
  const subject = `Registration confirmed — ${eventTitle}`;
  const html = `
    <div style="font-family: Poppins, Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #ea580c;">You're registered!</h2>
      <p>Hi ${name},</p>
      <p>Your registration for <strong>${eventTitle}</strong> is confirmed.</p>
      <div style="background: #fff7ed; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0;"><strong>When:</strong> ${eventDate}</p>
        <p style="margin: 8px 0 0;"><strong>Where:</strong> ${location}</p>
      </div>
      <p style="color: #64748b; font-size: 14px;">See you there!<br/>— EventFlow</p>
    </div>
  `;

  const transport = getTransporter();

  if (!transport) {
    console.log('\n📧 Registration email (SMTP not configured):');
    console.log(`   To: ${to}`);
    console.log(`   Event: ${eventTitle}`);
    console.log(`   Date: ${eventDate} | Location: ${location}\n`);
    return { sent: false, logged: true };
  }

  await transport.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
  });

  return { sent: true };
}
