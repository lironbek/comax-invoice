// Generate HTML from InvoiceModel using active template settings

import { InvoiceModel } from "./invoiceModel";
import { InvoiceSettings } from "@/components/InvoiceInterface";

// Format date to DD/MM/YYYY HH:mm
function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

// Format currency amount
function formatCurrency(amount: number, currency: string): string {
  const symbol = currency === "שקל" ? "₪" : currency;
  return `${symbol}${amount.toFixed(2)}`;
}

// Escape HTML special characters
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m] || m);
}

export function generateInvoiceHtml(model: InvoiceModel, settings: InvoiceSettings): string {
  const { backgroundColor, textColor, promotionTextColor, font, topBanner, logo, bottomBanner, socialMedia } = settings;

  // Generate items rows
  const itemsHtml = model.items.map(item => {
    const codeHtml = item.code ? `<div style="font-size: 10px; opacity: 0.6;">${escapeHtml(item.code)}</div>` : '';
    const promotionStyle = item.promotion ? `color: ${promotionTextColor};` : '';
    
    return `
      <tr style="${promotionStyle}">
        <td style="text-align: right; padding: 8px 4px; vertical-align: top;">
          <div style="font-weight: 500;">${escapeHtml(item.name)}</div>
          ${codeHtml}
          ${item.itemInfo ? `<div style="font-size: 10px; opacity: 0.7;">${escapeHtml(item.itemInfo)}</div>` : ''}
        </td>
        <td style="text-align: center; padding: 8px 4px;">${item.quantity}</td>
        <td style="text-align: center; padding: 8px 4px;">${formatCurrency(item.unitPrice, model.currency)}</td>
        <td style="text-align: left; padding: 8px 4px;">${formatCurrency(item.lineTotal, model.currency)}</td>
      </tr>
    `;
  }).join('');

  // Generate discount row if discount > 0
  const discountHtml = model.discount > 0 ? `
    <tr style="color: ${promotionTextColor};">
      <td style="text-align: right; padding: 8px 4px; font-weight: 500;">הנחה</td>
      <td style="text-align: center; padding: 8px 4px;"></td>
      <td style="text-align: center; padding: 8px 4px;"></td>
      <td style="text-align: left; padding: 8px 4px;">${formatCurrency(model.discount, model.currency)}-</td>
    </tr>
  ` : '';

  // Generate payments html
  const paymentsHtml = model.payments.map(payment => {
    const infoDetails = [payment.paymentInfo, payment.comments].filter(Boolean).join(' ');
    return `
      <div style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 500; margin-bottom: 4px;">${escapeHtml(payment.methodName)}</div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>${infoDetails ? escapeHtml(infoDetails) : ''}</span>
          <span style="font-weight: 500;">${formatCurrency(payment.amount, model.currency)}</span>
        </div>
      </div>
    `;
  }).join('');

  // Top banner HTML
  const topBannerHtml = topBanner ? `
    <div style="width: 100%; height: 180px; overflow: hidden;">
      <img src="${topBanner}" alt="Banner" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  ` : `
    <div style="width: 100%; height: 180px; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center;">
      <div style="width: 64px; height: 64px; background: white; border-radius: 8px;"></div>
    </div>
  `;

  // Logo HTML
  const logoHtml = logo ? `
    <div style="width: 140px; height: 140px; margin: 0 auto 16px; overflow: hidden; border-radius: 8px;">
      <img src="${logo}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  ` : `
    <div style="width: 140px; height: 140px; margin: 0 auto 16px; background-color: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
      <div style="width: 64px; height: 64px; background: white; border-radius: 8px;"></div>
    </div>
  `;

  // Bottom banner HTML
  const bottomBannerHtml = bottomBanner ? `
    <div style="width: 100%; height: 180px; overflow: hidden;">
      <img src="${bottomBanner}" alt="Banner" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  ` : `
    <div style="width: 100%; height: 180px; background-color: #f3f4f6; display: flex; align-items: center; justify-content: center;">
      <div style="width: 64px; height: 64px; background: white; border-radius: 8px;"></div>
    </div>
  `;

  // Social media HTML
  let socialHtml = '';
  const hasSocial = socialMedia.facebook || socialMedia.instagram || socialMedia.other;
  if (hasSocial) {
    const socialLinks = [];
    if (socialMedia.facebook) {
      socialLinks.push(`<a href="${escapeHtml(socialMedia.facebook)}" target="_blank" rel="noopener noreferrer" style="width: 32px; height: 32px; display: inline-block;"><img src="/lovable-uploads/2e2fff5d-abaa-435a-bfb6-417155d41560.png" alt="Facebook" style="width: 100%; height: 100%; object-fit: contain;" /></a>`);
    }
    if (socialMedia.instagram) {
      socialLinks.push(`<a href="${escapeHtml(socialMedia.instagram)}" target="_blank" rel="noopener noreferrer" style="width: 32px; height: 32px; display: inline-block;"><img src="/lovable-uploads/a6964d17-68d2-4f0a-879e-40402b8c0a2c.png" alt="Instagram" style="width: 100%; height: 100%; object-fit: contain;" /></a>`);
    }
    if (socialMedia.other) {
      socialLinks.push(`<a href="${escapeHtml(socialMedia.other)}" target="_blank" rel="noopener noreferrer" style="width: 32px; height: 32px; display: inline-block;"><img src="/lovable-uploads/e6268c0c-e32f-41a8-b2e6-6211cd2edb0d.png" alt="Social" style="width: 100%; height: 100%; object-fit: contain;" /></a>`);
    }
    socialHtml = `
      <div style="padding: 16px 24px; text-align: center;">
        <div style="display: flex; justify-content: center; gap: 16px;">
          ${socialLinks.join('')}
        </div>
      </div>
    `;
  }

  // Build summary rows
  const summaryRows = [];
  
  if (model.totalNoVat > 0) {
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>סכום ללא מע"מ</span>
        <span>${formatCurrency(model.totalNoVat, model.currency)}</span>
      </div>
    `);
  }
  
  if (model.vatAmount > 0) {
    const vatLabel = model.vatPercent > 0 ? `מע"מ (${model.vatPercent}%)` : 'מע"מ';
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>${vatLabel}</span>
        <span>${formatCurrency(model.vatAmount, model.currency)}</span>
      </div>
    `);
  }

  summaryRows.push(`
    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-weight: 600;">
      <span>סה"כ לתשלום</span>
      <span>${formatCurrency(model.total, model.currency)}</span>
    </div>
  `);

  if (model.receiptNumber) {
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>מספר חשבונית</span>
        <span>${escapeHtml(model.receiptNumber)}</span>
      </div>
    `);
  }

  if (model.createdAt) {
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>תאריך ושעה</span>
        <span>${formatDate(model.createdAt)}</span>
      </div>
    `);
  }

  if (model.posId) {
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>מספר קופה</span>
        <span>${escapeHtml(model.posId)}</span>
      </div>
    `);
  }

  if (model.cashierName) {
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>קופאי/ת</span>
        <span>${escapeHtml(model.cashierName)}</span>
      </div>
    `);
  }

  if (model.customerName) {
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>לקוח</span>
        <span>${escapeHtml(model.customerName)}</span>
      </div>
    `);
  }

  const html = `<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>חשבונית ${model.receiptNumber || ''}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${font}, Arial, sans-serif;
      background-color: #f5f5f5;
      padding: 20px;
      direction: rtl;
    }
    .invoice-container {
      max-width: 390px;
      margin: 0 auto;
      background-color: ${backgroundColor};
      color: ${textColor};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      text-align: right;
      padding: 8px 4px;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
    }
    th:nth-child(2), th:nth-child(3) {
      text-align: center;
    }
    th:nth-child(4) {
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Top Banner -->
    ${topBannerHtml}

    <!-- Company Info -->
    <div style="padding: 24px; text-align: center;">
      ${logoHtml}
      <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">שם החברה</h2>
      ${model.branchId ? `<p style="font-size: 14px; margin-bottom: 16px;">סניף ${escapeHtml(model.branchId)}</p>` : '<p style="font-size: 14px; margin-bottom: 16px;">שם הסניף</p>'}
      <div style="font-size: 28px; font-weight: 700;">${formatCurrency(model.total, model.currency)}</div>
    </div>

    <!-- Items Table -->
    <div style="padding: 0 24px 16px;">
      <table>
        <thead>
          <tr>
            <th style="text-align: right;">פריט</th>
            <th style="text-align: center;">כמות</th>
            <th style="text-align: center;">מחיר</th>
            <th style="text-align: left;">סה"כ</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          ${discountHtml}
        </tbody>
      </table>
    </div>

    <!-- Payments -->
    ${model.payments.length > 0 ? `
    <div style="padding: 0 24px 16px;">
      <div style="max-width: 340px; margin: 0 auto;">
        ${paymentsHtml}
      </div>
    </div>
    ` : ''}

    <!-- Summary -->
    <div style="padding: 0 24px 16px; font-size: 14px;">
      ${summaryRows.join('')}
    </div>

    <!-- Barcode -->
    ${model.receiptNumber ? `
    <div style="padding: 16px 24px; text-align: center;">
      <div style="font-family: 'Libre Barcode 39', monospace; font-size: 48px; letter-spacing: 4px;">
        *${escapeHtml(model.receiptNumber)}*
      </div>
      <div style="font-size: 12px; margin-top: 4px;">${escapeHtml(model.receiptNumber)}</div>
    </div>
    ` : ''}

    <!-- Bottom Banner -->
    ${bottomBannerHtml}

    <!-- Social Media -->
    ${socialHtml}

    <!-- Powered By -->
    <div style="padding: 16px 24px; text-align: center; font-size: 12px; border-top: 1px solid #e5e7eb;">
      Powered By <span style="color: #3DB065; font-weight: 700;">COMAX</span>
    </div>
  </div>
</body>
</html>`;

  return html;
}
