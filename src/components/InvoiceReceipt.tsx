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
              className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          )}
          {settings.socialMedia.instagram && (
            <a 
              href={settings.socialMedia.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          )}
          {settings.socialMedia.other && (
            <a 
              href={settings.socialMedia.other} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
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