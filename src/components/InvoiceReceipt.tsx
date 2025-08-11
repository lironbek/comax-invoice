import { InvoiceSettings } from "./InvoiceInterface";

interface InvoiceReceiptProps {
  settings: InvoiceSettings;
  onSettingsChange?: (newSettings: Partial<InvoiceSettings>) => void;
}

export default function InvoiceReceipt({ settings, onSettingsChange }: InvoiceReceiptProps) {
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, field: 'topBanner' | 'bottomBanner' | 'logo') => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile && onSettingsChange) {
      const imageUrl = URL.createObjectURL(imageFile);
      onSettingsChange({ [field]: imageUrl });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="w-full max-w-[390px] bg-white shadow-xl overflow-hidden"
      style={{ 
        backgroundColor: settings.backgroundColor,
        color: settings.textColor,
        fontFamily: settings.font
      }}
    >
      {/* Top Banner */}
      <div 
        className="w-full h-[180px] bg-receipt-lightgray flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-transparent hover:border-blue-300 transition-colors"
        onDrop={(e) => handleDrop(e, 'topBanner')}
        onDragOver={handleDragOver}
        onDragEnter={(e) => e.preventDefault()}
      >
        {settings.topBanner ? (
          <img 
            src={settings.topBanner} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-receipt-gray">
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Company Info Section */}
      <div className="p-6 text-center">
        {/* Small Logo */}
        <div 
          className="w-[140px] h-[140px] bg-receipt-lightgray mx-auto mb-4 rounded flex items-center justify-center cursor-pointer border-2 border-dashed border-transparent hover:border-blue-300 transition-colors"
          onDrop={(e) => handleDrop(e, 'logo')}
          onDragOver={handleDragOver}
          onDragEnter={(e) => e.preventDefault()}
        >
          {settings.logo ? (
            <img 
              src={settings.logo} 
              alt="Logo" 
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <svg className="w-8 h-8 text-receipt-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {/* Company Name */}
        <h2 className="text-lg font-bold mb-1" style={{ color: settings.textColor }}>שם החברה</h2>
        <p className="text-sm mb-4" style={{ color: settings.textColor }}>שם הסניף</p>

        {/* Total Amount */}
        <div className="text-2xl font-bold" style={{ color: settings.textColor }}>₪00.00</div>
      </div>

      {/* Items Table */}
      <div className="px-6 pb-4">
        {/* Headers */}
        <div className="grid grid-cols-3 gap-4 text-sm font-bold border-b border-receipt-divider pb-2 mb-3" style={{ color: settings.textColor }}>
          <div className="text-right">פריט</div>
          <div className="text-center">כמות</div>
          <div className="text-left">סכום</div>
        </div>

        {/* Items */}
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-right">
              <div className="font-medium" style={{ color: settings.textColor }}>פריט</div>
              <div className="text-xs opacity-60" style={{ color: settings.textColor }}>ברקוד</div>
            </div>
            <div className="text-center" style={{ color: settings.textColor }}>1</div>
            <div className="text-left" style={{ color: settings.textColor }}>₪00.00</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-right">
              <div className="font-medium" style={{ color: settings.textColor }}>פריט</div>
              <div className="text-xs opacity-60" style={{ color: settings.textColor }}>ברקוד</div>
            </div>
            <div className="text-center" style={{ color: settings.textColor }}>1</div>
            <div className="text-left" style={{ color: settings.textColor }}>₪00.00</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-right">
              <div className="font-medium" style={{ color: settings.textColor }}>פריט</div>
              <div className="text-xs opacity-60" style={{ color: settings.textColor }}>ברקוד</div>
            </div>
            <div className="text-center" style={{ color: settings.textColor }}>1</div>
            <div className="text-left" style={{ color: settings.textColor }}>₪00.00</div>
          </div>

          {/* Discount */}
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-right" style={{ color: settings.promotionTextColor }}>הנחת מבצע</div>
            <div className="text-center"></div>
            <div className="text-left" style={{ color: settings.promotionTextColor }}>₪00.00-</div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-6 pb-4">
        <div className="max-w-[340px] mx-auto">
          <div className="border-t border-receipt-divider pt-4">
            <div className="text-sm">
              <div className="font-medium mb-1" style={{ color: settings.textColor }}>אשראי</div>
              <div style={{ color: settings.textColor }}>תשלומים: 1 ****1234 ₪00.00</div>
            </div>
          </div>
          <div className="border-b border-receipt-divider pb-4"></div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 pb-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <div className="text-right" style={{ color: settings.textColor }}>סכום ללא מע"מ</div>
          <div style={{ color: settings.textColor }}>₪00.00</div>
        </div>
        <div className="flex justify-between">
          <div className="text-right" style={{ color: settings.textColor }}>מע"מ</div>
          <div style={{ color: settings.textColor }}>₪00.00</div>
        </div>
        <div className="flex justify-between">
          <div className="text-right" style={{ color: settings.textColor }}>סכום לתשלום</div>
          <div style={{ color: settings.textColor }}>₪00.00</div>
        </div>
        <div className="flex justify-between">
          <div className="text-right" style={{ color: settings.textColor }}>מספר חשבונית</div>
          <div style={{ color: settings.textColor }}>1005041234</div>
        </div>
        <div className="flex justify-between">
          <div className="text-right" style={{ color: settings.textColor }}>תאריך ושעה</div>
          <div style={{ color: settings.textColor }}>20:03 2024-11-23</div>
        </div>
        <div className="flex justify-between">
          <div className="text-right" style={{ color: settings.textColor }}>מספר קופה</div>
          <div style={{ color: settings.textColor }}>8</div>
        </div>
        <div className="flex justify-between">
          <div className="text-right" style={{ color: settings.textColor }}>קופאי/ת</div>
          <div style={{ color: settings.textColor }}>ישראל לוי</div>
        </div>
      </div>

      {/* Download Button */}
      <div className="px-6 pb-4">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm border border-receipt-border rounded" style={{ color: settings.textColor }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          הורדת מסמך מקור
        </button>
      </div>

      {/* Footer Text */}
      <div className="px-6 pb-4 text-xs text-center leading-relaxed" style={{ color: settings.textColor }}>
        לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קונדימנטום קורטיס 
        ניבה, מאסה כתם לבין לקולבהר. סמ טטי פר רועי. גן זמנים עליי פאן עשק 
        טבולה לבקריה, יצי נמס לעמק הקואץ. איטא קונהק
      </div>

      {/* HR below footer text */}
      <div className="px-6">
        <div className="border-b border-receipt-divider"></div>
      </div>

      {/* Barcode */}
      <div className="px-6 pb-4">
        <div className="flex flex-col items-center">
          <img 
            src="/lovable-uploads/8494e468-2f1b-47b8-8486-821a6b9ff1f7.png"
            alt="Barcode"
            className="h-20 object-contain mb-2"
          />
        </div>
      </div>

      {/* Bottom Banner */}
      <div 
        className="w-full h-[180px] bg-receipt-lightgray flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed border-transparent hover:border-blue-300 transition-colors"
        onDrop={(e) => handleDrop(e, 'bottomBanner')}
        onDragOver={handleDragOver}
        onDragEnter={(e) => e.preventDefault()}
      >
        {settings.bottomBanner ? (
          <img 
            src={settings.bottomBanner} 
            alt="Bottom Banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center text-receipt-gray">
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center mb-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Social Media Icons */}
      {(settings.socialMedia.facebook || settings.socialMedia.instagram || settings.socialMedia.other) && (
        <div className="px-6 py-4 flex justify-center items-center gap-4">
          {settings.socialMedia.facebook && (
            <a 
              href={settings.socialMedia.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/2e2fff5d-abaa-435a-bfb6-417155d41560.png" 
                alt="Facebook" 
                className="w-8 h-8 object-contain"
              />
            </a>
          )}
          {settings.socialMedia.instagram && (
            <a 
              href={settings.socialMedia.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/a6964d17-68d2-4f0a-879e-40402b8c0a2c.png" 
                alt="Instagram" 
                className="w-8 h-8 object-contain"
              />
            </a>
          )}
          {settings.socialMedia.other && (
            <a 
              href={settings.socialMedia.other} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <img 
                src="/lovable-uploads/e6268c0c-e32f-41a8-b2e6-6211cd2edb0d.png" 
                alt="TikTok" 
                className="w-8 h-8 object-contain"
              />
            </a>
          )}
        </div>
      )}

      {/* Powered By */}
      <div className="px-6 py-4 flex justify-center items-center text-xs border-t border-receipt-divider">
        <div style={{ color: settings.textColor }}>
          Powered By <span className="text-receipt-green font-bold">COMAX</span>
        </div>
      </div>
    </div>
  );
}