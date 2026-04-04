// ── Customer Confirmation Email via Resend ──
// Sends a branded confirmation email to the customer after quote submission.
// Uses RESEND_API_KEY env var. If not set, skips silently.
// Includes the April 20% promo offer.
//
// CRITICAL: Never hardcode API keys.

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
}

function buildConfirmationHtml(data: QuoteData): string {
  const isFr = !data.locale || data.locale === "fr";

  const greeting = isFr
    ? `Bonjour ${data.name},`
    : `Hello ${data.name},`;

  const thankYou = isFr
    ? `Merci pour votre demande de soumission! Notre equipe l'a bien recue et un specialiste vous contactera dans les prochaines heures.`
    : `Thank you for your quote request! Our team has received it and a specialist will contact you within the next few hours.`;

  const promoTitle = isFr
    ? `OFFRE SPECIALE — AVRIL 2026`
    : `SPECIAL OFFER — APRIL 2026`;

  const promoText = isFr
    ? `Profitez de <strong>20% de rabais</strong> sur tous nos systemes de revetement pour le mois d'avril! Mentionnez le code <strong>AVRIL20</strong> lors de votre consultation.`
    : `Enjoy <strong>20% off</strong> all our coating systems for the month of April! Mention the code <strong>APRIL20</strong> during your consultation.`;

  const summaryTitle = isFr ? `Votre demande` : `Your request`;
  const contactTitle = isFr ? `Nous joindre` : `Contact us`;
  const closing = isFr
    ? `Au plaisir de collaborer avec vous!`
    : `We look forward to working with you!`;

  const projectLabel = isFr ? "Type de projet" : "Project type";
  const surfaceLabel = isFr ? "Surface" : "Surface area";
  const productLabel = isFr ? "Produit" : "Product";

  const summaryRows: string[] = [];
  if (data.projectType) {
    summaryRows.push(`<tr><td style="padding:6px 12px;color:#999;">${projectLabel}</td><td style="padding:6px 12px;color:#fff;">${data.projectType}</td></tr>`);
  }
  if (data.surfaceArea) {
    summaryRows.push(`<tr><td style="padding:6px 12px;color:#999;">${surfaceLabel}</td><td style="padding:6px 12px;color:#fff;">${data.surfaceArea} pi2</td></tr>`);
  }
  if (data.product) {
    summaryRows.push(`<tr><td style="padding:6px 12px;color:#999;">${productLabel}</td><td style="padding:6px 12px;color:#fff;">${data.product}</td></tr>`);
  }

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">

    <!-- Header -->
    <div style="text-align:center;padding:24px 0;border-bottom:1px solid #27272a;">
      <h1 style="margin:0;font-size:28px;color:#C9A84C;letter-spacing:2px;">NOVUS SURFACES</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#71717a;letter-spacing:3px;">REVETEMENTS HAUT DE GAMME</p>
    </div>

    <!-- Greeting -->
    <div style="padding:24px 0;">
      <p style="color:#fafafa;font-size:16px;line-height:1.6;margin:0 0 16px;">${greeting}</p>
      <p style="color:#a1a1aa;font-size:14px;line-height:1.6;margin:0;">${thankYou}</p>
    </div>

    <!-- Promo Banner -->
    <div style="background:linear-gradient(135deg,#5C4A1E 0%,#1f1f23 100%);border:1px solid #C9A84C;border-radius:8px;padding:20px 24px;margin:16px 0 24px;">
      <p style="margin:0 0 8px;color:#C9A84C;font-size:14px;font-weight:bold;letter-spacing:1px;">${promoTitle}</p>
      <p style="margin:0;color:#fafafa;font-size:14px;line-height:1.5;">${promoText}</p>
    </div>

    ${summaryRows.length > 0 ? `
    <!-- Summary -->
    <div style="background:#18181b;border:1px solid #27272a;border-radius:8px;padding:16px;margin:0 0 24px;">
      <p style="margin:0 0 12px;color:#C9A84C;font-size:14px;font-weight:bold;">${summaryTitle}</p>
      <table style="width:100%;border-collapse:collapse;">${summaryRows.join("")}</table>
    </div>
    ` : ""}

    <!-- Contact -->
    <div style="padding:16px 0;border-top:1px solid #27272a;">
      <p style="color:#C9A84C;font-size:14px;font-weight:bold;margin:0 0 8px;">${contactTitle}</p>
      <p style="color:#a1a1aa;font-size:14px;line-height:1.8;margin:0;">
        Jason Lanthier<br>
        <a href="tel:+15813072678" style="color:#C9A84C;text-decoration:none;">581-307-2678</a><br>
        <a href="mailto:gestionnovusepoxy@gmail.com" style="color:#C9A84C;text-decoration:none;">gestionnovusepoxy@gmail.com</a><br>
        <a href="https://novusepoxy.ca" style="color:#C9A84C;text-decoration:none;">novusepoxy.ca</a>
      </p>
    </div>

    <!-- Closing -->
    <div style="padding:16px 0;border-top:1px solid #27272a;">
      <p style="color:#fafafa;font-size:14px;margin:0;">${closing}</p>
      <p style="color:#71717a;font-size:12px;margin:8px 0 0;">— ${isFr ? "L'equipe" : "The team"} Novus Surfaces</p>
    </div>

  </div>
</body>
</html>`;
}

/**
 * Send a branded confirmation email to the customer via Resend.
 * Skips silently if RESEND_API_KEY is not configured.
 * Never throws — form submission always succeeds.
 */
export async function sendCustomerConfirmation(data: QuoteData): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn("[resend-confirm] RESEND_API_KEY not set — skipping customer confirmation");
    return false;
  }

  const isFr = !data.locale || data.locale === "fr";
  const subject = isFr
    ? `Novus Surfaces — Votre demande de soumission a ete recue`
    : `Novus Surfaces — Your quote request has been received`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Novus Surfaces <noreply@novusepoxy.shop>",
        to: [data.email],
        reply_to: "gestionnovusepoxy@gmail.com",
        subject,
        html: buildConfirmationHtml(data),
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[resend-confirm] Resend returned ${response.status}: ${body}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[resend-confirm] Failed to send confirmation:", err);
    return false;
  }
}
