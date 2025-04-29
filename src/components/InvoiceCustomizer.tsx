
import { useState } from "react";
import { Card } from "@/components/ui/card";
import InvoicePreview from "@/components/InvoicePreview";
import CustomizationPanel from "@/components/CustomizationPanel";

export interface InvoiceSettings {
  bannerImage: string | null;
  secondaryBannerImage: string | null;
  logo: string | null;
  backgroundColor: string;
  innerFrameColor: string;
  outerFrameColor: string;
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
  font: "Arial",
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

  return (
    <div className="container mx-auto p-4 max-w-7xl rtl">
      <h1 className="text-3xl font-bold mb-6 text-center">התאמה אישית של חשבונית</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-1 lg:order-1">
          <Card className="overflow-hidden shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">תצוגה מקדימה של החשבונית</h2>
              <p className="text-sm text-muted-foreground mb-4">
                צפייה מקדימה באופן שבו החשבונית תופיע ללקוחות
              </p>
            </div>
            <InvoicePreview settings={settings} />
          </Card>
        </div>
        
        <div className="order-2 lg:order-2">
          <Card className="shadow-md p-6">
            <div className="space-y-6">
              <CustomizationPanel 
                settings={settings} 
                onSettingsChange={handleSettingsChange}
                onSocialMediaChange={handleSocialMediaChange}
                onFileRemove={handleFileRemove}
                onSave={handleSaveChanges}
                isSaving={isSaving}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
