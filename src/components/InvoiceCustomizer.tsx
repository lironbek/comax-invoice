
import { useState } from "react";
import { Card } from "@/components/ui/card";
import InvoicePreview from "@/components/InvoicePreview";
import CustomizationPanel from "@/components/CustomizationPanel";
import AppHeader from "@/components/AppHeader";

export interface InvoiceSettings {
  bannerImage: string | null;
  secondaryBannerImage: string | null;
  logo: string | null;
  backgroundColor: string;
  innerFrameColor: string;
  outerFrameColor: string;
  textColor: string;
  discountColor: string;
  font: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

const defaultSettings: InvoiceSettings = {
  bannerImage: null,
  secondaryBannerImage: null,
  logo: null,
  backgroundColor: "#ffffff",
  innerFrameColor: "#f3f3f3",
  outerFrameColor: "#f8f8f8",
  textColor: "#000000",
  discountColor: "#ff6b35",
  font: "Noto Sans Hebrew",
  socialMedia: {
    facebook: "",
    instagram: "",
    tiktok: "",
  },
};

export default function InvoiceCustomizer() {
  const [settings, setSettings] = useState<InvoiceSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleFileRemove = (field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    setSettings((prev) => ({
      ...prev,
      [field]: null
    }));
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onReset={handleReset} />
      
      <div className="flex h-[calc(100vh-80px)]">
        {/* Invoice Preview - Left Side */}
        <div className="flex-1 invoice-container p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <InvoicePreview settings={settings} onSettingsChange={handleSettingsChange} />
          </div>
        </div>
        
        {/* Customization Panel - Right Side */}
        <div className="w-96 customization-panel overflow-y-auto">
          <div className="p-6">
            <CustomizationPanel 
              settings={settings} 
              onSettingsChange={handleSettingsChange}
              onSocialMediaChange={handleSocialMediaChange}
              onFileRemove={handleFileRemove}
              onSave={handleSaveChanges}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
