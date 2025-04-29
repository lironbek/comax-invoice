import { InvoiceSettings } from "./InvoiceCustomizer";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, MessageSquare, Barcode } from "lucide-react";

interface InvoicePreviewProps {
  settings: InvoiceSettings;
}

export default function InvoicePreview({ settings }: InvoicePreviewProps) {
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
  
  const fontClass = `font-${font.toLowerCase()}`;
  const currencySymbol = "₪";
  const hasSocialMedia = Object.values(socialMedia).some(url => url.trim() !== "");

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
          {/* Banner Image */}
          <div className="w-full bg-gray-300 h-32 flex items-center justify-center overflow-hidden">
            {bannerImage ? (
              <img 
                src={bannerImage} 
                alt="Invoice Banner" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-gray-700">BANNER</span>
            )}
          </div>

          {/* Company Logo */}
          <div className="p-6 text-center">
            {logo && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={logo} 
                  alt="Company Logo" 
                  className="h-16 object-contain" 
                />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="px-8">
            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            {/* Invoice Items */}
            <div className="py-2">
              <div className="grid grid-cols-3 gap-4 font-bold text-sm mb-2">
                <div>WORTH</div>
                <div className="text-center">AMMOUNT</div>
                <div className="text-right">ITEM NAME</div>
              </div>
              
              {[1, 2, 3].map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-1 text-sm">
                  <div>{currencySymbol} 49.90</div>
                  <div className="text-center">1</div>
                  <div className="text-right">
                    <div>ITEM NAME</div>
                    <div className="text-xs text-gray-500">BARCODE</div>
                  </div>
                </div>
              ))}
              
              {/* Discount */}
              <div className="grid grid-cols-3 gap-4 py-2 text-sm text-amber-500">
                <div>{currencySymbol} - 15.00</div>
                <div className="text-center"></div>
                <div className="text-right">Discount Name</div>
              </div>
            </div>

            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            {/* Payment Information */}
            <div className="p-6 space-y-1 text-center text-sm">
              <p>Payment methood</p>
              <p>sum before VAT</p>
              <p>VAT worth</p>
              <p>Total Payment</p>
              <p>Invoice number</p>
              <p>DOC DateTime</p>
              <p>POS num</p>
              <p>Employee</p>
            </div>

            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            {/* Footer */}
            <div className="p-6 text-center">
              <p className="text-lg font-bold mb-4">FOOTER TEXT</p>
              
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

              {/* Secondary Banner */}
              <div className="w-full bg-gray-300 h-24 flex items-center justify-center overflow-hidden mt-4">
                {secondaryBannerImage ? (
                  <img 
                    src={secondaryBannerImage} 
                    alt="Secondary Banner" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-700">SECONDARY BANNER</span>
                )}
              </div>
              
              {/* Powered By Footer */}
              <div className="flex justify-between items-center text-sm mt-6">
                <div>
                  Powered By <span className="text-green-500 font-bold">COMAX</span>
                </div>
                <div className="text-blue-500">
                  Download Original Doc
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
