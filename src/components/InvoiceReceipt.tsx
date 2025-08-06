import { Download, Facebook, Instagram, MessageSquare } from "lucide-react";
import { InvoiceSettings } from "./InvoiceInterface";

interface InvoiceReceiptProps {
  settings: InvoiceSettings;
}

interface InvoiceItem {
  name: string;
  barcode: string;
  quantity: number;
  price: string;
}

const defaultItems: InvoiceItem[] = [
  { name: "פריט", barcode: "ברקוד", quantity: 1, price: "₪00.00" },
  { name: "פריט", barcode: "ברקוד", quantity: 1, price: "₪00.00" },
  { name: "פריט", barcode: "ברקוד", quantity: 1, price: "₪00.00" },
];

export default function InvoiceReceipt({ settings }: InvoiceReceiptProps) {
  const { logo, topBanner, bottomBanner, socialMedia } = settings;
  
  const hasSocialMedia = Object.values(socialMedia).some(url => url.trim() !== "");

  return (
    <div className="w-full max-w-[390px] bg-white shadow-xl overflow-hidden">
      {/* Top Banner/Logo Placeholder */}
      <div className="w-full h-[180px] bg-receipt-lightgray flex items-center justify-center overflow-hidden">
        {topBanner ? (
          <img 
            src={topBanner} 
            alt="באנר עליון" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-receipt-gray">
            <div className="w-12 h-12 border-2 border-dashed border-receipt-gray rounded flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Company Section */}
        <div className="text-center mb-6">
          {/* Small Logo */}
          <div className="flex justify-center mb-3">
            {logo ? (
              <img 
                src={logo} 
                alt="לוגו חברה" 
                className="w-[70px] h-[70px] object-contain"
              />
            ) : (
              <div className="w-[70px] h-[70px] bg-receipt-lightgray rounded flex items-center justify-center">
                <span className="text-receipt-gray text-xs">לוגו</span>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold mb-1">שם החברה</h2>
          <h3 className="text-base text-receipt-gray">שם הסניף</h3>
        </div>

        {/* Total Amount */}
        <div className="text-center mb-6">
          <span className="text-3xl font-bold">₪00.00</span>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          {/* Headers */}
          <div className="grid grid-cols-3 gap-4 pb-2 border-b border-receipt-divider">
            <div className="text-sm font-medium">סכום</div>
            <div className="text-sm font-medium text-center">כמות</div>
            <div className="text-sm font-medium text-right">פריט</div>
          </div>
          
          {/* Items */}
          <div className="space-y-3 py-3">
            {defaultItems.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                <div>{item.price}</div>
                <div className="text-center">{item.quantity}</div>
                <div className="text-right">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-receipt-gray">{item.barcode}</div>
                </div>
              </div>
            ))}
            
            {/* Discount */}
            <div className="grid grid-cols-3 gap-4 text-sm text-receipt-orange">
              <div>₪-00.00</div>
              <div className="text-center"></div>
              <div className="text-right">הנחת מבצע</div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="text-right mb-6 pb-4 border-b border-receipt-divider">
          <div className="font-bold mb-1">אשראי</div>
          <div className="text-sm text-receipt-gray">
            ₪00.00 תשלומים: 1 ****1234
          </div>
        </div>

        {/* Summary Section */}
        <div className="space-y-2 text-sm mb-6">
          <div className="flex justify-between">
            <span>₪00.00</span>
            <span>סכום ללא מע״מ</span>
          </div>
          <div className="flex justify-between">
            <span>₪00.00</span>
            <span>מע״מ</span>
          </div>
          <div className="flex justify-between">
            <span>₪00.00</span>
            <span>סכום לתשלום</span>
          </div>
          <div className="flex justify-between">
            <span>1005041234</span>
            <span>מספר חשבונית</span>
          </div>
          <div className="flex justify-between">
            <span>2024-11-23 20:03</span>
            <span>תאריך ושעה</span>
          </div>
          <div className="flex justify-between">
            <span>8</span>
            <span>מספר קופה</span>
          </div>
          <div className="flex justify-between">
            <span>ישראל לוי</span>
            <span>קופאי/ת</span>
          </div>
        </div>

        {/* Download Button */}
        <div className="text-center mb-6">
          <button className="flex items-center justify-center gap-2 text-sm text-receipt-gray hover:text-receipt-text transition-colors">
            <Download className="w-4 h-4" />
            <span>הורדת מסמך מקור</span>
          </button>
        </div>

        {/* Footer Text */}
        <div className="text-center text-sm text-receipt-gray mb-6 px-4">
          לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית צש בליא, 
          מוסן מנופש לפרומי בדיק וקפיצה במבבל המבוכר.
        </div>

        {/* Barcode */}
        <div className="text-center mb-6">
          <div className="bg-receipt-lightgray p-4 rounded mb-2">
            <div className="bg-black h-16 w-full rounded flex items-center justify-center">
              <span className="text-white text-xs">|||||||||||||||||||</span>
            </div>
          </div>
          <div className="text-sm text-receipt-gray">20240101005041234</div>
        </div>

        {/* Social Media Icons */}
        {hasSocialMedia && (
          <div className="flex justify-center gap-4 mb-6">
            {socialMedia.facebook && (
              <a 
                href={socialMedia.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {socialMedia.instagram && (
              <a 
                href={socialMedia.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-800"
              >
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {socialMedia.other && (
              <a 
                href={socialMedia.other} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-receipt-gray hover:text-receipt-text"
              >
                <MessageSquare className="w-6 h-6" />
              </a>
            )}
          </div>
        )}

        {/* Bottom Banner */}
        <div className="w-full h-24 bg-receipt-lightgray rounded overflow-hidden mb-6">
          {bottomBanner ? (
            <img 
              src={bottomBanner} 
              alt="באנר תחתון" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-receipt-gray text-sm">באנר תחתון</span>
            </div>
          )}
        </div>

        {/* Powered By Footer */}
        <div className="flex justify-between items-center text-sm">
          <div className="text-receipt-gray">
            Powered By <span className="text-receipt-green font-bold">COMAX</span>
          </div>
          <div className="text-blue-500">
            אפס מקל
          </div>
        </div>
      </div>
    </div>
  );
}