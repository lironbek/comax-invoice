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

// Convert image URL to Base64 data URI
async function imageToBase64(url: string): Promise<string> {
  if (!url) return '';
  
  // If already a data URI, return as-is
  if (url.startsWith('data:')) return url;
  
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        resolve(''); // Return empty on error
      };
      reader.readAsDataURL(blob);
    });
  } catch {
    console.warn('Failed to convert image to base64:', url);
    return '';
  }
}

// Convert all images in settings to Base64
export async function convertImagesToBase64(settings: InvoiceSettings): Promise<InvoiceSettings> {
  const [topBannerBase64, logoBase64, bottomBannerBase64] = await Promise.all([
    settings.topBanner ? imageToBase64(settings.topBanner) : Promise.resolve(''),
    settings.logo ? imageToBase64(settings.logo) : Promise.resolve(''),
    settings.bottomBanner ? imageToBase64(settings.bottomBanner) : Promise.resolve('')
  ]);
  
  return {
    ...settings,
    topBanner: topBannerBase64,
    logo: logoBase64,
    bottomBanner: bottomBannerBase64
  };
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

  // Get base URL for absolute image paths
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Helper to make image URL absolute
  const absoluteUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Top banner HTML - only show if exists
  const topBannerHtml = topBanner ? `
    <div style="width: 100%; height: 180px; overflow: hidden;">
      <img src="${absoluteUrl(topBanner)}" alt="Banner" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  ` : '';

  // Logo HTML - only show if exists
  const logoHtml = logo ? `
    <div style="width: 140px; height: 140px; margin: 0 auto 16px; overflow: hidden; border-radius: 8px; background-color: #f3f4f6;">
      <img src="${absoluteUrl(logo)}" alt="Logo" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  ` : '';

  // Bottom banner HTML - only show if exists
  const bottomBannerHtml = bottomBanner ? `
    <div style="width: 100%; height: 180px; overflow: hidden;">
      <img src="${absoluteUrl(bottomBanner)}" alt="Banner" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  ` : '';

  // SVG icons for social media (inline to work in any HTML viewer)
  const tiktokSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>';
  const instagramSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>';
  const facebookSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';

  // Social media HTML with inline SVGs
  let socialHtml = '';
  const hasSocial = socialMedia.facebook || socialMedia.instagram || socialMedia.other;
  if (hasSocial) {
    const socialLinks = [];
    
    if (socialMedia.other) {
      socialLinks.push(`<a href="${escapeHtml(socialMedia.other)}" target="_blank" rel="noopener noreferrer" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; color: ${textColor};">${tiktokSvg}</a>`);
    }
    if (socialMedia.instagram) {
      socialLinks.push(`<a href="${escapeHtml(socialMedia.instagram)}" target="_blank" rel="noopener noreferrer" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; color: ${textColor};">${instagramSvg}</a>`);
    }
    if (socialMedia.facebook) {
      socialLinks.push(`<a href="${escapeHtml(socialMedia.facebook)}" target="_blank" rel="noopener noreferrer" style="width: 32px; height: 32px; display: inline-flex; align-items: center; justify-content: center; color: ${textColor};">${facebookSvg}</a>`);
    }
    socialHtml = `
      <div style="padding: 16px 24px; text-align: center;">
        <div style="display: flex; justify-content: center; gap: 16px;">
          ${socialLinks.join('')}
        </div>
      </div>
    `;
  }

  // Download source button SVG icon
  const downloadSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';

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

  if (model.posNumber) {
    summaryRows.push(`
      <div style="display: flex; justify-content: space-between; padding: 4px 0;">
        <span>מספר קופה</span>
        <span>${escapeHtml(model.posNumber)}</span>
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
      <h2 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">${model.companyName ? escapeHtml(model.companyName) : 'שם החברה'}</h2>
      ${model.branchName ? `<p style="font-size: 14px; margin-bottom: 16px;">סניף ${escapeHtml(model.branchName)}</p>` : '<p style="font-size: 14px; margin-bottom: 16px;">שם הסניף</p>'}
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

    <!-- Download Source Button -->
    <div style="padding: 0 24px 16px;">
      <button onclick="window.print()" style="width: 100%; padding: 12px 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: transparent; color: ${textColor}; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit;">
        ${downloadSvg}
        הורדת מסמך מקור
      </button>
    </div>

    <!-- Barcode -->
    ${model.barcode ? `
    <div style="padding: 16px 24px; text-align: center;">
      <img src="https://barcodeapi.org/api/128/${encodeURIComponent(model.barcode)}" alt="Barcode" style="max-width: 100%; height: 60px;" />
      <div style="font-size: 12px; margin-top: 4px;">${escapeHtml(model.barcode)}</div>
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
