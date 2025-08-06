import { InvoiceSettings } from "./InvoiceCustomizer";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, MessageSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface InvoicePreviewProps {
  settings: InvoiceSettings;
  onSettingsChange?: (settings: Partial<InvoiceSettings>) => void;
}

export default function InvoicePreview({ settings, onSettingsChange }: InvoicePreviewProps) {
  const [dragStates, setDragStates] = useState({
    bannerImage: false,
    secondaryBannerImage: false,
    logo: false
  });

  const { 
    bannerImage, 
    secondaryBannerImage,
    logo, 
    backgroundColor,
    textColor,
    discountColor,
    font,
    socialMedia
  } = settings;
  
  const fontClass = font === 'Noto Sans Hebrew' ? 'font-hebrew' : `font-${font.toLowerCase()}`;
  const currencySymbol = "₪";
  const hasSocialMedia = Object.values(socialMedia).some(url => url.trim() !== "");

  const handleFileUpload = (file: File, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    if (!file || !onSettingsChange) return;
    const imageUrl = URL.createObjectURL(file);
    onSettingsChange({ [field]: imageUrl });
  };

  const handleDragOver = (e: React.DragEvent, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    e.preventDefault();
    if (!onSettingsChange) return;
    setDragStates(prev => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e: React.DragEvent, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    if (!onSettingsChange) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileUpload(file, field);
      }
    }
  };

  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden max-w-md mx-auto">
      <div 
        className={`w-full ${fontClass} rtl`}
        style={{ backgroundColor, color: textColor }}
      >
        {/* Banner Image */}
        <div 
          className={`w-full bg-gray-100 h-32 flex items-center justify-center overflow-hidden cursor-pointer transition-colors ${
            dragStates.bannerImage ? 'bg-green-100 border-2 border-green-500 border-dashed' : ''
          }`}
          onDragOver={(e) => handleDragOver(e, 'bannerImage')}
          onDragLeave={(e) => handleDragLeave(e, 'bannerImage')}
          onDrop={(e) => handleDrop(e, 'bannerImage')}
        >
          {bannerImage ? (
            <img 
              src={bannerImage} 
              alt="Invoice Banner" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-300 rounded mx-auto mb-2 flex items-center justify-center">
                <span className="text-xs text-gray-500">תמונה</span>
              </div>
            </div>
          )}
        </div>

        {/* Company Logo and Header */}
        <div className="p-4 text-center" style={{ color: textColor }}>
          <div 
            className={`w-20 h-20 bg-gray-100 mx-auto mb-4 rounded flex items-center justify-center cursor-pointer transition-colors ${
              dragStates.logo ? 'bg-green-100 border-2 border-green-500 border-dashed' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'logo')}
            onDragLeave={(e) => handleDragLeave(e, 'logo')}
            onDrop={(e) => handleDrop(e, 'logo')}
          >
            {logo ? (
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded mx-auto flex items-center justify-center">
                  <span className="text-xs text-gray-500">לוגו</span>
                </div>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold mb-1">שם החברה</h2>
          <h3 className="text-md">שם הסניף</h3>
        </div>

        {/* Main Content */}
        <div className="px-6">
          {/* Total Sum */}
          <div className="text-center py-4">
            <span className="text-2xl font-bold">
              {currencySymbol}00.00
            </span>
          </div>

          {/* Invoice Items Header */}
          <div className="py-2">
            <div className="grid grid-cols-3 gap-4 font-bold text-sm mb-1">
              <div>סכום</div>
              <div className="text-center">כמות</div>
              <div className="text-right font-bold">פריט</div>
            </div>
            
            <Separator className="my-2" />
            
            {/* Invoice Items List */}
            <div className="py-2 space-y-2">
              <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                <div>{currencySymbol}00.00</div>
                <div className="text-center">1</div>
                <div className="text-right">
                  <div className="font-bold">פריט</div>
                  <div className="text-xs text-gray-500">ברקוד</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                <div>{currencySymbol}00.00</div>
                <div className="text-center">1</div>
                <div className="text-right">
                  <div className="font-bold">פריט</div>
                  <div className="text-xs text-gray-500">ברקוד</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                <div>{currencySymbol}00.00</div>
                <div className="text-center">1</div>
                <div className="text-right">
                  <div className="font-bold">פריט</div>
                  <div className="text-xs text-gray-500">ברקוד</div>
                </div>
              </div>
              
              {/* Discount */}
              <div className="grid grid-cols-3 gap-4 py-2 text-sm" style={{ color: discountColor }}>
                <div>-{currencySymbol}00.00</div>
                <div className="text-center"></div>
                <div className="text-right">הנחת מבצע</div>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Payment Method */}
          <div className="text-right py-2">
            <div className="py-2">
              <div className="font-bold">אשראי</div>
              <div className="text-sm">{currencySymbol}00.00 ****1234 1 תשלומים:</div>
            </div>
            <Separator className="my-2" />
          </div>

          {/* Payment Information */}
          <div className="py-4 space-y-1 text-right text-sm">
            <div className="grid grid-cols-2">
              <div className="text-left">{currencySymbol}00.00</div>
              <div>סכום ללא מע"מ</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-left">{currencySymbol}00.00</div>
              <div>מע"מ</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-left">{currencySymbol}00.00</div>
              <div>סכום לתשלום</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-left">1005041234</div>
              <div>מספר חשבונית</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-left">2024-11-23 20:03</div>
              <div>תאריך ושעה</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-left">8</div>
              <div>מספר קופה</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="text-left">ישראל לוי</div>
              <div>קופאי/ת</div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Download Button */}
          <div className="text-center py-2">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white font-hebrew">
              <Download className="h-4 w-4 ml-2" />
              הורדת מסמך מקור
            </Button>
          </div>

          {/* Footer Text */}
          <div className="text-center py-4">
            <p className="text-sm">
              לורם איפסום דולור סיט אמט, קונסקטטור אדיפיסיסינג אליט, סד דו 
              איוסמוד טמפור אינסידידונט אוט לברה את דולורה מגנה
            </p>
          </div>

          <Separator className="my-2" />

          {/* Barcode */}
          <div className="flex justify-center my-4">
            <div className="bg-black h-16 w-48 flex items-center justify-center">
              <div className="text-white text-xs">20240101005041234</div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Social Media Icons */}
          {hasSocialMedia && (
            <div className="flex justify-center gap-4 py-4">
              {socialMedia.facebook && (
                <a 
                  href={socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Facebook size={24} />
                </a>
              )}
              {socialMedia.instagram && (
                <a 
                  href={socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800"
                >
                  <Instagram size={24} />
                </a>
              )}
              {socialMedia.tiktok && (
                <a 
                  href={socialMedia.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-black hover:text-gray-800"
                >
                  <MessageSquare size={24} />
                </a>
              )}
            </div>
          )}

          {/* Secondary Banner */}
          <div 
            className={`w-full bg-gray-100 h-24 flex items-center justify-center overflow-hidden mt-4 cursor-pointer transition-colors ${
              dragStates.secondaryBannerImage ? 'bg-green-100 border-2 border-green-500 border-dashed' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'secondaryBannerImage')}
            onDragLeave={(e) => handleDragLeave(e, 'secondaryBannerImage')}
            onDrop={(e) => handleDrop(e, 'secondaryBannerImage')}
          >
            {secondaryBannerImage ? (
              <img 
                src={secondaryBannerImage} 
                alt="Secondary Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded mx-auto mb-2 flex items-center justify-center">
                  <span className="text-xs text-gray-500">תמונה</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Powered By Footer */}
          <div className="flex justify-between items-center text-sm py-4">
            <div>
              Powered By <span className="text-green-500 font-bold">COMAX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}