
import { InvoiceSettings } from "./InvoiceInterface";

interface InvoiceReceiptProps {
  settings: InvoiceSettings;
}

export default function InvoiceReceipt({ settings }: InvoiceReceiptProps) {
  return (
    <div className="w-full max-w-[390px] bg-white shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="w-full h-[180px] bg-receipt-lightgray flex items-center justify-center overflow-hidden">
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
        <div className="w-[70px] h-[70px] bg-receipt-lightgray mx-auto mb-4 rounded flex items-center justify-center">
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
        <h2 className="text-lg font-bold text-receipt-text mb-1">שם החברה</h2>
        <p className="text-sm text-receipt-gray mb-4">שם הסניף</p>

        {/* Total Amount */}
        <div className="text-2xl font-bold text-receipt-text">₪00.00</div>
      </div>

      {/* Items Table */}
      <div className="px-6 pb-4">
        {/* Headers */}
        <div className="grid grid-cols-3 gap-4 text-sm font-medium text-receipt-text border-b border-receipt-divider pb-2 mb-3">
          <div className="text-left">סכום</div>
          <div className="text-center">כמות</div>
          <div className="text-right">פריט</div>
        </div>

        {/* Items */}
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-left text-receipt-text">₪00.00</div>
            <div className="text-center text-receipt-text">1</div>
            <div className="text-right">
              <div className="text-receipt-text font-medium">פריט</div>
              <div className="text-xs text-receipt-gray">ברקוד</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-left text-receipt-text">₪00.00</div>
            <div className="text-center text-receipt-text">1</div>
            <div className="text-right">
              <div className="text-receipt-text font-medium">פריט</div>
              <div className="text-xs text-receipt-gray">ברקוד</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-left text-receipt-text">₪00.00</div>
            <div className="text-center text-receipt-text">1</div>
            <div className="text-right">
              <div className="text-receipt-text font-medium">פריט</div>
              <div className="text-xs text-receipt-gray">ברקוד</div>
            </div>
          </div>

          {/* Discount */}
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-left" style={{ color: settings.promotionTextColor }}>₪00.00-</div>
            <div className="text-center"></div>
            <div className="text-right" style={{ color: settings.promotionTextColor }}>הנחת מבצע</div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="px-6 pb-4">
        <div className="max-w-[340px] mx-auto">
          <div className="border-t border-receipt-divider pt-4">
            <div className="text-sm text-receipt-text">
              <div className="font-medium mb-1">אשראי</div>
              <div className="text-receipt-gray">תשלומים: 1 ****1234 ₪00.00</div>
            </div>
          </div>
          <div className="border-b border-receipt-divider pb-4"></div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 pb-4 space-y-1 text-sm">
        <div className="flex justify-between">
          <div className="text-receipt-text">₪00.00</div>
          <div className="text-receipt-gray">סכום ללא מע"מ</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-text">₪00.00</div>
          <div className="text-receipt-gray">מע"מ</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-text">₪00.00</div>
          <div className="text-receipt-gray">סכום לתשלום</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-text">1005041234</div>
          <div className="text-receipt-gray">מספר חשבונית</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-text">20:03 2024-11-23</div>
          <div className="text-receipt-gray">תאריך ושעה</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-text">8</div>
          <div className="text-receipt-gray">מספר קופה</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-text">ישראל לוי</div>
          <div className="text-receipt-gray">קופאי/ת</div>
        </div>
      </div>

      {/* Download Button */}
      <div className="px-6 pb-4">
        <button className="w-full flex items-center justify-center gap-2 py-2 text-sm text-receipt-gray border border-receipt-border rounded">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          הורדת מסמך מקור
        </button>
      </div>

      {/* Footer Text */}
      <div className="px-6 pb-4 text-xs text-center text-receipt-gray leading-relaxed">
        לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית קונדימנטום קורטיס 
        ניבה, מאסה כתם לבין לקולבהר. סמ טטי פר רועי. גן זמנים עליי פאן עשק 
        טבולה לבקריה, יצי נמס לעמק הקואץ. איטא קונהק
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
      <div className="w-full h-[180px] bg-receipt-lightgray flex items-center justify-center overflow-hidden">
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

      {/* Powered By */}
      <div className="px-6 py-4 flex justify-center items-center text-xs border-t border-receipt-divider">
        <div className="text-receipt-gray">
          Powered By <span className="text-receipt-green font-bold">COMAX</span>
        </div>
      </div>
    </div>
  );
}
