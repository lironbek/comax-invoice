
import { InvoiceSettings } from "./InvoiceInterface";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";

interface InvoiceReceiptProps {
  settings: InvoiceSettings;
  onSettingsChange?: (newSettings: Partial<InvoiceSettings>) => void;
}

export default function InvoiceReceipt({ settings, onSettingsChange }: InvoiceReceiptProps) {
  console.log('InvoiceReceipt rendered with onSettingsChange:', !!onSettingsChange);
  const [dragStates, setDragStates] = useState({
    topBanner: false,
    bottomBanner: false,
    logo: false
  });

  // Prevent default drag behavior only for non-drop-zone areas
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-drop-zone]')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('dragover', preventDefaults, false);
    document.addEventListener('drop', preventDefaults, false);

    return () => {
      document.removeEventListener('dragover', preventDefaults);
      document.removeEventListener('drop', preventDefaults);
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    console.log('Drag over prevented');
  };

  const handleDragEnter = (e: React.DragEvent, field: keyof typeof dragStates) => {
    e.preventDefault();
    e.stopPropagation();
    setDragStates(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, field: keyof typeof dragStates) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragStates(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleDrop = (e: React.DragEvent, field: 'topBanner' | 'bottomBanner' | 'logo') => {
    console.log('Drop event triggered for:', field);
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    const files = e.dataTransfer.files;
    console.log('Files in drop:', files.length);
    
    if (files.length > 0 && onSettingsChange) {
      const file = files[0];
      console.log('File type:', file.type);
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        onSettingsChange({ [field]: url });
        console.log(`Image uploaded for ${field}:`, url);
      } else {
        console.error("File is not an image");
      }
    } else {
      console.log('No files or onSettingsChange not available');
    }
  };

  const DropZone = ({ 
    field, 
    children, 
    className 
  }: { 
    field: 'topBanner' | 'bottomBanner' | 'logo'; 
    children: React.ReactNode; 
    className?: string; 
  }) => (
    <div
      data-drop-zone="true"
      className={`relative ${className || ''} ${dragStates[field] ? 'ring-2 ring-blue-400 ring-opacity-50 bg-blue-50' : ''} transition-all duration-200`}
      onDragOver={handleDragOver}
      onDragEnter={(e) => handleDragEnter(e, field)}
      onDragLeave={(e) => handleDragLeave(e, field)}
      onDrop={(e) => handleDrop(e, field)}
    >
      {children}
      {dragStates[field] && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-80 flex items-center justify-center z-10 rounded border-2 border-dashed border-blue-400">
          <div className="text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-blue-700 font-medium">Drop image here</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full max-w-[390px] bg-white shadow-xl overflow-hidden">
      {/* Top Banner */}
      <DropZone field="topBanner" className="w-full">
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
      </DropZone>

      {/* Company Info Section */}
      <div className="p-6 text-center">
        {/* Small Logo */}
        <DropZone field="logo" className="flex justify-center mb-4">
          <div className="w-[70px] h-[70px] bg-receipt-lightgray rounded flex items-center justify-center">
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
        </DropZone>

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
          <div className="text-right">פריט</div>
          <div className="text-center">כמות</div>
          <div className="text-left">סכום</div>
        </div>

        {/* Items */}
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-right">
              <div className="text-receipt-text font-medium">פריט</div>
              <div className="text-xs text-receipt-gray">ברקוד</div>
            </div>
            <div className="text-center text-receipt-text">1</div>
            <div className="text-left text-receipt-text">₪00.00</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-right">
              <div className="text-receipt-text font-medium">פריט</div>
              <div className="text-xs text-receipt-gray">ברקוד</div>
            </div>
            <div className="text-center text-receipt-text">1</div>
            <div className="text-left text-receipt-text">₪00.00</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-1">
            <div className="text-right">
              <div className="text-receipt-text font-medium">פריט</div>
              <div className="text-xs text-receipt-gray">ברקוד</div>
            </div>
            <div className="text-center text-receipt-text">1</div>
            <div className="text-left text-receipt-text">₪00.00</div>
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
          <div className="text-receipt-gray text-right">סכום ללא מע"מ</div>
          <div className="text-receipt-text">₪00.00</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-gray text-right">מע"מ</div>
          <div className="text-receipt-text">₪00.00</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-gray text-right">סכום לתשלום</div>
          <div className="text-receipt-text">₪00.00</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-gray text-right">מספר חשבונית</div>
          <div className="text-receipt-text">1005041234</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-gray text-right">תאריך ושעה</div>
          <div className="text-receipt-text">20:03 2024-11-23</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-gray text-right">מספר קופה</div>
          <div className="text-receipt-text">8</div>
        </div>
        <div className="flex justify-between">
          <div className="text-receipt-gray text-right">קופאי/ת</div>
          <div className="text-receipt-text">ישראל לוי</div>
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
      <DropZone field="bottomBanner" className="w-full">
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
      </DropZone>

      {/* Powered By */}
      <div className="px-6 py-4 flex justify-center items-center text-xs border-t border-receipt-divider">
        <div className="text-receipt-gray">
          Powered By <span className="text-receipt-green font-bold">COMAX</span>
        </div>
      </div>
    </div>
  );
}
