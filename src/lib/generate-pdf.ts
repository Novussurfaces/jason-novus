"use client";

import { jsPDF } from "jspdf";
import {
  type PriceEstimate,
  formatPrice,
  isAprilPromoActive,
  applyAprilPromo,
  APRIL_PROMO_PERCENT,
} from "./pricing";

export function generateEstimatePDF(
  estimate: PriceEstimate,
  locale: "fr" | "en",
  contactInfo: { name: string; email: string; phone: string }
): void {
  const doc = new jsPDF();
  const isFr = locale === "fr";

  // Colors
  const accent = [201, 168, 76]; // #C9A84C
  const dark = [9, 9, 11]; // #09090b
  const muted = [113, 113, 122]; // #71717a

  // Header bar
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(0, 0, 210, 40, "F");

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("NOVUS SURFACES", 20, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    isFr
      ? "Revêtements de planchers époxy haut de gamme"
      : "Premium Epoxy Floor Coatings",
    20,
    32
  );

  // Date
  doc.setFontSize(9);
  doc.text(new Date().toLocaleDateString(isFr ? "fr-CA" : "en-CA"), 170, 22);

  // Title
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(
    isFr ? "Estimation de projet" : "Project Estimate",
    20,
    60
  );

  // Client info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.text(isFr ? "Préparé pour:" : "Prepared for:", 20, 72);
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFont("helvetica", "bold");
  doc.text(contactInfo.name, 20, 79);
  doc.setFont("helvetica", "normal");
  doc.text(contactInfo.email, 20, 85);
  doc.text(contactInfo.phone, 20, 91);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 98, 190, 98);

  // Project details
  let y = 110;
  const labelX = 20;
  const valueX = 90;

  const addRow = (label: string, value: string) => {
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(label, labelX, y);
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFont("helvetica", "bold");
    doc.text(value, valueX, y);
    y += 10;
  };

  addRow(
    isFr ? "Système:" : "System:",
    estimate.product.name[locale]
  );
  addRow(
    isFr ? "Chimie:" : "Chemistry:",
    estimate.product.specs.chemistry
  );
  addRow(
    isFr ? "Superficie:" : "Surface area:",
    `${estimate.sqft.toLocaleString()} ${isFr ? "pi²" : "sq ft"}`
  );
  addRow(
    isFr ? "Prix/pi²:" : "Price/sq ft:",
    `${formatPrice(estimate.pricePerSqFtRange.min)} – ${formatPrice(estimate.pricePerSqFtRange.max)}`
  );

  if (estimate.discount.percent > 0) {
    addRow(
      isFr ? "Rabais volume:" : "Volume discount:",
      `-${estimate.discount.label}`
    );
  }

  const promoActive = isAprilPromoActive();

  if (promoActive) {
    addRow(
      isFr ? "Promo Avril:" : "April Promo:",
      `-${APRIL_PROMO_PERCENT}%`
    );
  }

  // Price box
  y += 10;

  if (promoActive) {
    // Show before-promo price crossed out
    doc.setFillColor(250, 248, 240);
    doc.roundedRect(20, y, 170, 48, 3, 3, "F");

    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      isFr ? "Prix avant promo:" : "Price before promo:",
      30,
      y + 10
    );

    doc.setFontSize(12);
    doc.text(
      `${formatPrice(estimate.totalMin)} – ${formatPrice(estimate.totalMax)}`,
      30,
      y + 18
    );

    // Draw strikethrough line
    const textWidth = doc.getTextWidth(
      `${formatPrice(estimate.totalMin)} – ${formatPrice(estimate.totalMax)}`
    );
    doc.setDrawColor(muted[0], muted[1], muted[2]);
    doc.setLineWidth(0.5);
    doc.line(30, y + 16, 30 + textWidth, y + 16);

    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      isFr ? "Avec promo Avril (-20%):" : "With April promo (-20%):",
      30,
      y + 28
    );

    doc.setFontSize(18);
    doc.text(
      `${formatPrice(applyAprilPromo(estimate.totalMin))} – ${formatPrice(applyAprilPromo(estimate.totalMax))}`,
      30,
      y + 40
    );

    y += 48;
  } else {
    doc.setFillColor(245, 245, 250);
    doc.roundedRect(20, y, 170, 30, 3, 3, "F");

    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      isFr ? "Estimation totale:" : "Total estimate:",
      30,
      y + 12
    );

    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${formatPrice(estimate.totalMin)} – ${formatPrice(estimate.totalMax)}`,
      30,
      y + 24
    );

    y += 30;
  }

  // Disclaimer
  y += 15;
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const promoDisclaimer = promoActive
    ? isFr
      ? " La promo Avril de 20% est valide jusqu'au 30 avril 2026."
      : " The April 20% promo is valid through April 30, 2026."
    : "";
  const disclaimer = isFr
    ? `* Cette estimation est fournie à titre indicatif. Le prix final dépend de l'état du béton, de l'accès au site et des options choisies.${promoDisclaimer} Contactez-nous pour une soumission détaillée.`
    : `* This estimate is for informational purposes only. Final pricing depends on concrete condition, site access, and selected options.${promoDisclaimer} Contact us for a detailed quote.`;
  const lines = doc.splitTextToSize(disclaimer, 170);
  doc.text(lines, 20, y);

  // Footer
  doc.setFillColor(accent[0], accent[1], accent[2]);
  doc.rect(0, 277, 210, 20, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text("info@novusepoxy.ca | novusepoxy.ca", 20, 288);
  doc.text(
    isFr ? "Fabriqué au Canada" : "Made in Canada",
    170,
    288
  );

  // Save
  doc.save(
    `novus-surfaces-${isFr ? "estimation" : "estimate"}-${Date.now()}.pdf`
  );
}
