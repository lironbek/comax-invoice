
import { useState } from "react";
import { User } from "lucide-react";
import InvoiceReceipt from "./InvoiceReceipt";
import EditingSidebar from "./EditingSidebar";

export interface InvoiceSettings {
  template: string;
  topBanner: string | null;
  logo: string | null;
  bottomBanner: string | null;
  font: string;
  backgroundColor: string;
  textColor: string;
  promotionTextColor: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    other: string;
  };
}

const defaultSettings: InvoiceSettings = {
  template: "לבן נקי",
  topBanner: null,
  logo: null,
  bottomBanner: null,
  font: "Assistant",
  backgroundColor: "#ffffff",
  textColor: "#1B2534",
  promotionTextColor: "#E69409",
  socialMedia: {
    facebook: "",
    instagram: "",
    other: "",
  },
};

export default function InvoiceInterface() {
  const [settings, setSettings] = useState<InvoiceSettings>(defaultSettings);

  const handleSettingsChange = (newSettings: Partial<InvoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSocialMediaChange = (
    platform: keyof InvoiceSettings["socialMedia"],
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("שמירת שינויים:", settings);
  };

  const handleCreateTemplate = () => {
    console.log("יצירת טמפלט חדש");
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-background font-assistant rtl-container">
      {/* Header Bar */}
      <header className="bg-receipt-green h-20 flex items-center justify-between px-6 text-white">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6" />
          <span className="font-medium">שם משתמש</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium">שם חברה</span>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-receipt-green font-bold text-sm">ח</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex"> 
        {/* Editing Sidebar - Left Side */}
        <div className="w-[630px] border-r border-receipt-border bg-white">
          <EditingSidebar
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onSocialMediaChange={handleSocialMediaChange}
            onSave={handleSave}
            onCreateTemplate={handleCreateTemplate}
            onReset={handleReset}
          />
        </div>

        {/* Invoice Receipt - Right Side */}
        <div className="flex-1 p-8 flex justify-center bg-gray-50">
          <InvoiceReceipt settings={settings} />
        </div>
      </div>
    </div>
  );
}
