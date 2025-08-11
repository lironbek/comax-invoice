
import { useState, useEffect } from "react";
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
  topBannerIsPromotional: boolean;
  logoIsPromotional: boolean;
  bottomBannerIsPromotional: boolean;
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
  topBannerIsPromotional: false,
  logoIsPromotional: false,
  bottomBannerIsPromotional: false,
  socialMedia: {
    facebook: "",
    instagram: "",
    other: "",
  },
};

export default function InvoiceInterface() {
  const [settings, setSettings] = useState<InvoiceSettings>(defaultSettings);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSettingsChange = (newSettings: Partial<InvoiceSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      
      // Apply template presets when template changes
      if ('template' in newSettings && newSettings.template !== prev.template) {
        const templateSettings = getTemplateSettings(newSettings.template!);
        Object.assign(updated, templateSettings);
      }
      
      return updated;
    });
  };

  const getTemplateSettings = (template: string): Partial<InvoiceSettings> => {
    switch (template) {
      case 'לבן נקי':
        return {
          backgroundColor: '#ffffff',
          textColor: '#1B2534',
          promotionTextColor: '#E69409',
          font: 'Assistant'
        };
      case 'תכלת חלומי':
        return {
          backgroundColor: '#f0f8ff',
          textColor: '#1a365d',
          promotionTextColor: '#2b77ad',
          font: 'Assistant'
        };
      case 'קרם שקדי':
        return {
          backgroundColor: '#faf8f3',
          textColor: '#4a4037',
          promotionTextColor: '#b8860b',
          font: 'Assistant'
        };
      case 'ורוד מרשמלו':
        return {
          backgroundColor: '#fdf2f8',
          textColor: '#831843',
          promotionTextColor: '#be185d',
          font: 'Assistant'
        };
      default:
        return {};
    }
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
    const templateName = prompt('הכנס שם טמפלט:');
    if (templateName) {
      const templateKey = `template_${templateName}`;
      localStorage.setItem(templateKey, JSON.stringify(settings));
      alert(`טמפלט "${templateName}" נשמר בהצלחה!`);
      console.log('Template saved:', templateName, settings);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-background font-assistant rtl-container">
      {/* Header Bar */}
      <header className={`bg-receipt-green h-20 flex items-center justify-between px-6 text-white transition-all duration-300 ease-in-out sticky top-0 z-50 ${
        isScrolled ? 'transform -translate-y-2 shadow-lg h-16' : 'transform translate-y-0'
      }`}>
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
      <div className="flex h-[calc(100vh-5rem)]"> 
        {/* Editing Sidebar - Left Side */}
        <div className="w-[400px] border-r border-receipt-border bg-white overflow-y-auto">
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
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8 flex justify-center min-h-full">
            <InvoiceReceipt settings={settings} onSettingsChange={handleSettingsChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
