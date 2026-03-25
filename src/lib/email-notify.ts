// ── Direct Email Notification via Gmail SMTP ──
// Sends an internal notification to gestionnovusepoxy@gmail.com
// when someone submits the soumission form.
// Bypasses n8n — works even if n8n cloud is down.

import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_NOTIFY_USER || "gestionnovusepoxy@gmail.com";
const GMAIL_PASS = process.env.GMAIL_NOTIFY_PASS || "";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: GMAIL_USER, pass: GMAIL_PASS },
});

interface QuoteData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  surfaceArea?: string;
  product?: string;
  message?: string;
  locale?: string;
  [key: string]: unknown;
}

export async function notifyNewQuote(data: QuoteData): Promise<boolean> {
  if (!GMAIL_PASS) {
    console.warn("[email-notify] GMAIL_NOTIFY_PASS not set — skipping email");
    return false;
  }

  const subject = `Nouvelle soumission — ${data.name}${data.company ? ` (${data.company})` : ""}`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a1a;color:#ddd;padding:24px;border-radius:8px;">
      <h2 style="color:#C5A45D;margin:0 0 16px;">Nouvelle demande de soumission</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#888;width:140px;">Nom</td><td style="padding:8px 0;color:#fff;font-weight:bold;">${data.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888;">Courriel</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#C5A45D;">${data.email}</a></td></tr>
        ${data.phone ? `<tr><td style="padding:8px 0;color:#888;">Telephone</td><td style="padding:8px 0;"><a href="tel:${data.phone}" style="color:#C5A45D;">${data.phone}</a></td></tr>` : ""}
        ${data.company ? `<tr><td style="padding:8px 0;color:#888;">Entreprise</td><td style="padding:8px 0;color:#fff;">${data.company}</td></tr>` : ""}
        ${data.projectType ? `<tr><td style="padding:8px 0;color:#888;">Type de projet</td><td style="padding:8px 0;color:#fff;">${data.projectType}</td></tr>` : ""}
        ${data.surfaceArea ? `<tr><td style="padding:8px 0;color:#888;">Surface (pi2)</td><td style="padding:8px 0;color:#fff;">${data.surfaceArea}</td></tr>` : ""}
        ${data.product ? `<tr><td style="padding:8px 0;color:#888;">Produit</td><td style="padding:8px 0;color:#fff;">${data.product}</td></tr>` : ""}
        ${data.message ? `<tr><td style="padding:8px 0;color:#888;">Message</td><td style="padding:8px 0;color:#fff;">${data.message}</td></tr>` : ""}
      </table>
      <hr style="border:1px solid #333;margin:16px 0;">
      <p style="font-size:12px;color:#666;margin:0;">Novus Epoxy — Notification automatique</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Novus Soumission" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: data.email,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error("[email-notify] Failed to send notification:", err);
    return false;
  }
}
