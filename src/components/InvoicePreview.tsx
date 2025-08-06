import { InvoiceSettings } from "./InvoiceCustomizer";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, MessageSquare, Upload } from "lucide-react";
import { useState, useEffect } from "react";

interface InvoicePreviewProps {
  settings: InvoiceSettings;
  onSettingsChange?: (newSettings: Partial<InvoiceSettings>) => void;
}

export default function InvoicePreview({ settings, onSettingsChange }: InvoicePreviewProps) {
  const { 
    bannerImage, 
    secondaryBannerImage,
    logo, 
    backgroundColor,
    innerFrameColor,
    outerFrameColor,
    font,
    socialMedia
  } = settings;
  
  const [dragStates, setDragStates] = useState({
    bannerImage: false,
    logo: false,
    secondaryBannerImage: false
  });
  
  const fontClass = `font-${font.toLowerCase()}`;
  const currencySymbol = "₪";
  const hasSocialMedia = Object.values(socialMedia).some(url => url.trim() !== "");

  // Prevent default drag behavior on the entire document
  useEffect(() => {
    const preventDefaults = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener('dragenter', preventDefaults, false);
    document.addEventListener('dragover', preventDefaults, false);
    document.addEventListener('dragleave', preventDefaults, false);
    document.addEventListener('drop', preventDefaults, false);

    return () => {
      document.removeEventListener('dragenter', preventDefaults);
      document.removeEventListener('dragover', preventDefaults);
      document.removeEventListener('dragleave', preventDefaults);
      document.removeEventListener('drop', preventDefaults);
    };
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
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

  const handleDrop = (e: React.DragEvent, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragStates(prev => ({ ...prev, [field]: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && onSettingsChange) {
      const file = files[0];
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        onSettingsChange({ [field]: url });
        console.log(`Image uploaded for ${field}:`, url);
      } else {
        console.error("File is not an image");
      }
    }
  };

  const DropZone = ({ 
    field, 
    children, 
    className 
  }: { 
    field: 'bannerImage' | 'secondaryBannerImage' | 'logo'; 
    children: React.ReactNode; 
    className?: string; 
  }) => (
    <div
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
    <div 
      className="w-full overflow-hidden p-6"
      style={{ backgroundColor: outerFrameColor }}
    >
      <div 
        className="w-full overflow-hidden p-4"
        style={{ backgroundColor: innerFrameColor }}
      >
        <div 
          className={`w-full max-w-[500px] mx-auto overflow-hidden ${fontClass}`}
          style={{ backgroundColor }}
        >
          {/* Banner Image with Drop Zone */}
          <DropZone field="bannerImage" className="w-full">
            <div className="w-full bg-gray-300 h-32 flex items-center justify-center overflow-hidden">
              {bannerImage ? (
                <img 
                  src={bannerImage} 
                  alt="Invoice Banner" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-gray-700">באנר</span>
              )}
            </div>
          </DropZone>

          {/* Company & Branch Information */}
          <div className="p-4 text-center">
            {/* Company Logo with Drop Zone - Now positioned above company name */}
            <DropZone field="logo" className="mb-3 flex justify-center">
              {logo ? (
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  className="h-[300px] w-[300px] object-contain" 
                />
              ) : (
                <div className="h-[300px] w-[300px] bg-gray-200 flex items-center justify-center rounded">
                  <span className="text-lg text-gray-500">לוגו</span>
                </div>
              )}
            </DropZone>
            
            <h2 className="text-xl font-bold mb-1">שם החברה</h2>
            <h3 className="text-md">שם הסניף</h3>
          </div>

          {/* Main Content */}
          <div className="px-8">
            {/* Total Sum Frame at top with HRs */}
            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
              <div className="text-center py-2">
                <span className="text-2xl font-bold">
                  {currencySymbol} 00.0
                </span>
              </div>
              <Separator className="my-2" />
            </div>

            {/* Invoice Items Header */}
            <div className="py-2">
              <div className="grid grid-cols-3 gap-4 font-bold text-sm mb-1">
                <div>סכום</div>
                <div className="text-center">כמות</div>
                <div className="text-right font-bold">פריט</div>
              </div>
              
              {/* HR below the title */}
              <Separator className="my-2" />
              
              {/* Invoice Items List */}
              <div className="py-2 space-y-2">
                <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                  <div>{currencySymbol} 00.00</div>
                  <div className="text-center">1</div>
                  <div className="text-right">
                    <div className="font-bold">פריט</div>
                    <div className="text-xs text-gray-500">ברקוד</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                  <div>{currencySymbol} 00.00</div>
                  <div className="text-center">1</div>
                  <div className="text-right">
                    <div className="font-bold">פריט</div>
                    <div className="text-xs text-gray-500">ברקוד</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-1 text-sm">
                  <div>{currencySymbol} 00.00</div>
                  <div className="text-center">1</div>
                  <div className="text-right">
                    <div className="font-bold">פריט</div>
                    <div className="text-xs text-gray-500">ברקוד</div>
                  </div>
                </div>
                
                {/* Discount */}
                <div className="grid grid-cols-3 gap-4 py-2 text-sm text-amber-500">
                  <div>{currencySymbol} -00.00</div>
                  <div className="text-center"></div>
                  <div className="text-right">הנחת מבצע</div>
                </div>
              </div>
            </div>

            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            {/* Payment Method with HR framing - aligned right, removed top HR */}
            <div className="text-right py-2">
              <div className="py-2">
                <div className="font-bold">אשראי</div>
                <div className="text-sm">{currencySymbol}785.8 1 תשלומים: ****5644</div>
              </div>
              <Separator className="my-2" />
            </div>

            {/* Payment Information */}
            <div className="py-4 space-y-1 text-right text-sm">
              <div className="grid grid-cols-2">
                <div className="text-left">{currencySymbol}652.21</div>
                <div>סכום ללא מע"מ</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-left">{currencySymbol}133.58</div>
                <div>מע"מ</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-left">{currencySymbol}785.8</div>
                <div>סכום לתשלום</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-left">1005046383</div>
                <div>מספר חשבונית</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-left">2024-11-23 20:03</div>
                <div>תאריך</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-left">8</div>
                <div>מספר קופה</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="text-left">חנה</div>
                <div>קופאי/ת</div>
              </div>
            </div>

            <div className="max-w-[400px] mx-auto">
              <Separator className="my-4" />
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
              {/* Footer Text with lorem ipsum, removed top HR */}
              <p className="text-sm py-2 text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <Separator className="my-2" />
              
              <p className="text-lg font-bold my-4">DOC 652</p>
              
              {/* Barcode */}
              <div className="flex justify-center my-4">
                <img 
                  src="/lovable-uploads/8494e468-2f1b-47b8-8486-821a6b9ff1f7.png"
                  alt="Barcode"
                  className="h-16 object-contain"
                />
              </div>

              <div className="max-w-[400px] mx-auto">
                <Separator className="my-4" />
              </div>

              {/* Social Media Icons */}
              {hasSocialMedia && (
                <>
                  <div className="flex justify-center space-x-4 my-4">
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
                  <div className="max-w-[400px] mx-auto">
                    <Separator className="my-4" />
                  </div>
                </>
              )}

              {/* Secondary Banner with Drop Zone */}
              <DropZone field="secondaryBannerImage" className="w-full">
                <div className="w-full bg-gray-300 h-24 flex items-center justify-center overflow-hidden mt-4 rounded">
                  {secondaryBannerImage ? (
                    <img 
                      src={secondaryBannerImage} 
                      alt="Secondary Banner" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-700">באנר</span>
                  )}
                </div>
              </DropZone>
              
              {/* Powered By Footer */}
              <div className="flex justify-between items-center text-sm mt-6">
                <div>
                  Powered By <span className="text-green-500 font-bold">COMAX</span>
                </div>
                <div className="text-blue-500">
                  הורד מסמך מקור
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
