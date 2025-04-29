
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

  // Generate random prices
  const generateRandomPrice = (min: number, max: number) => {
    return (Math.random() * (max - min) + min).toFixed(2);
  };

  // Sample invoice data with randomized values
  const invoiceItems = [
    {
      name: "סוללות AA",
      barcode: "2160067",
      price: generateRandomPrice(30, 50),
      qty: 1
    },
    {
      name: "מקדח 6 מ\"מ",
      barcode: "1144454",
      price: generateRandomPrice(20, 30),
      qty: 1
    },
    {
      name: "מקדח מקיטה 20V",
      barcode: "1145014",
      price: generateRandomPrice(800, 1000),
      qty: 1
    }
  ];
  
  const discountAmount = generateRandomPrice(150, 200);
  const subTotal = invoiceItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
  const totalAfterDiscount = subTotal - parseFloat(discountAmount);
  const vat = (totalAfterDiscount * 0.17).toFixed(2);
  const total = (parseFloat(totalAfterDiscount) + parseFloat(vat)).toFixed(2);
  const invoiceNumber = "10050" + Math.floor(Math.random() * 100000);
  const date = "2024-" + (Math.floor(Math.random() * 12) + 1) + "-" + (Math.floor(Math.random() * 28) + 1);

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
          className={`w-full max-w-[500px] mx-auto overflow-hidden ${fontClass} rtl`}
          style={{ backgroundColor }}
        >
          {/* Banner Image */}
          <div className="w-full bg-gray-300 h-32 flex items-center justify-center overflow-hidden">
            {bannerImage ? (
              <img 
                src={bannerImage} 
                alt="תמונת באנר"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-bold mb-2">מבצע מיוחד</div>
                <div className="text-xl">29-31.12.24</div>
              </div>
            )}
          </div>

          {/* Company Logo */}
          <div className="p-6 text-center">
            {logo && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={logo} 
                  alt="לוגו חברה" 
                  className="h-16 object-contain" 
                />
              </div>
            )}
            <div className="text-lg font-bold">
              כלי עבודה וציוד בע"מ
            </div>
            <div className="text-md">
              סניף רמלה
            </div>
          </div>

          {/* Main Content */}
          <div className="px-8">
            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            <div className="text-center text-2xl font-bold my-4">
              {currencySymbol} {total}
            </div>

            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            {/* Invoice Items */}
            <div className="py-2">
              <div className="grid grid-cols-3 gap-4 font-bold text-sm mb-2">
                <div>סכום</div>
                <div className="text-center">כמות</div>
                <div className="text-right">פריט</div>
              </div>
              
              {invoiceItems.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-1 text-sm">
                  <div>{currencySymbol} {item.price}</div>
                  <div className="text-center">{item.qty}</div>
                  <div className="text-right">
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-500">{item.barcode}</div>
                  </div>
                </div>
              ))}
              
              {/* Discount */}
              <div className="grid grid-cols-3 gap-4 py-2 text-sm text-amber-500">
                <div>{currencySymbol} - {discountAmount}</div>
                <div className="text-center"></div>
                <div className="text-right">20% הנחה מוצרי מקיטה</div>
              </div>
            </div>

            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            {/* Payment Information */}
            <div className="p-6 space-y-1 text-sm">
              <div className="flex justify-between">
                <div>אשראי</div>
                <div>אמצעי תשלום</div>
              </div>
              <div className="flex justify-between">
                <div>{currencySymbol} {(subTotal - parseFloat(discountAmount)).toFixed(2)}</div>
                <div>סכום ללא מע"מ</div>
              </div>
              <div className="flex justify-between">
                <div>{currencySymbol} {vat}</div>
                <div>מע"מ</div>
              </div>
              <div className="flex justify-between">
                <div>{currencySymbol} {total}</div>
                <div>סכום לתשלום</div>
              </div>
              <div className="flex justify-between">
                <div>{invoiceNumber}</div>
                <div>מספר חשבונית</div>
              </div>
              <div className="flex justify-between">
                <div>{date}</div>
                <div>תאריך</div>
              </div>
              <div className="flex justify-between">
                <div>8</div>
                <div>מספר קופה</div>
              </div>
              <div className="flex justify-between">
                <div>חנה</div>
                <div>קופאי/ת</div>
              </div>
            </div>

            <div className="max-w-[400px] mx-auto">
              <Separator className="my-2" />
            </div>

            {/* Footer */}
            <div className="p-6 text-center">
              <p className="text-md my-4">
                בחתימתי אני מאשר את קבלת הטובין ואת תנאי מכירת הטובין המופיעים בגב המסמך. התשלום חל בלתי נפרד ממסמך זה
              </p>
              
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
              
              {/* Barcode */}
              <div className="flex justify-center my-4">
                <img 
                  src="/lovable-uploads/4b889a43-6992-4e01-83ef-c0e69ed466e9.png"
                  alt="ברקוד"
                  className="h-16 object-contain"
                />
              </div>

              <div className="max-w-[400px] mx-auto">
                <Separator className="my-4" />
              </div>

              {/* Secondary Banner */}
              <div className="w-full bg-gray-300 h-32 flex items-center justify-center overflow-hidden mt-4">
                {secondaryBannerImage ? (
                  <img 
                    src={secondaryBannerImage} 
                    alt="באנר משני" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-700">באנר משני</span>
                )}
              </div>
              
              {/* Powered By Footer */}
              <div className="flex justify-between items-center text-sm mt-6">
                <div>
                  הורד מסמך מקור
                </div>
                <div>
                  Powered By <span className="text-[#34A853] font-bold">COMAX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
