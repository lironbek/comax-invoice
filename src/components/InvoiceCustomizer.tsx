
import { useState } from "react";
import { Card } from "@/components/ui/card";
import InvoicePreview from "@/components/InvoicePreview";
import CustomizationPanel from "@/components/CustomizationPanel";
import TemplateModal from "@/components/TemplateModal";

export interface InvoiceSettings {
  bannerImage: string | null;
  secondaryBannerImage: string | null;
  logo: string | null;
  topBanner: string | null;
  bottomBanner: string | null;
  backgroundColor: string;
  innerFrameColor: string;
  outerFrameColor: string;
  font: string;
  template: string;
  textColor: string;
  promotionTextColor: string;
  topBannerIsPromotional: boolean;
  logoIsPromotional: boolean;
  bottomBannerIsPromotional: boolean;
  socialMedia: {
    facebook: string;
    instagram: string;
    tiktok: string;
    other: string;
  };
}

const defaultSettings: InvoiceSettings = {
  bannerImage: null,
  secondaryBannerImage: null,
  logo: null,
  topBanner: null,
  bottomBanner: null,
  backgroundColor: "#ffffff",
  innerFrameColor: "#f3f3f3",
  outerFrameColor: "#f8f8f8",
  font: "Arial",
  template: "לבן נקי",
  textColor: "#000000",
  promotionTextColor: "#f59e0b",
  topBannerIsPromotional: false,
  logoIsPromotional: false,
  bottomBannerIsPromotional: false,
  socialMedia: {
    facebook: "",
    instagram: "",
    tiktok: "",
    other: "",
  },
};

export default function InvoiceCustomizer() {
  const [settings, setSettings] = useState<InvoiceSettings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<Array<{name: string, settings: InvoiceSettings}>>([]);

  const handleSettingsChange = (newSettings: Partial<InvoiceSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      
      // Apply template presets when template changes
      if ('template' in newSettings && newSettings.template !== prev.template) {
        const templateSettings = getTemplateSettings(newSettings.template!);
        Object.assign(updated, templateSettings);
      }
      
      // Sync topBanner with bannerImage and bottomBanner with secondaryBannerImage
      if ('topBanner' in newSettings) {
        updated.bannerImage = newSettings.topBanner;
      }
      if ('bottomBanner' in newSettings) {
        updated.secondaryBannerImage = newSettings.bottomBanner;
      }
      if ('bannerImage' in newSettings) {
        updated.topBanner = newSettings.bannerImage;
      }
      if ('secondaryBannerImage' in newSettings) {
        updated.bottomBanner = newSettings.secondaryBannerImage;
      }
      
      return updated;
    });
  };

  const getTemplateSettings = (template: string): Partial<InvoiceSettings> => {
    switch (template) {
      case 'לבן נקי':
        return {
          backgroundColor: '#ffffff',
          innerFrameColor: '#f8f9fa',
          outerFrameColor: '#e9ecef',
          textColor: '#212529',
          promotionTextColor: '#dc3545',
          font: 'Assistant'
        };
      case 'תכלת חלומי':
        return {
          backgroundColor: '#f0f8ff',
          innerFrameColor: '#e6f3ff',
          outerFrameColor: '#cce7ff',
          textColor: '#1a365d',
          promotionTextColor: '#2b77ad',
          font: 'Assistant'
        };
      case 'קרם שקדי':
        return {
          backgroundColor: '#faf8f3',
          innerFrameColor: '#f5f0e8',
          outerFrameColor: '#ede4d3',
          textColor: '#4a4037',
          promotionTextColor: '#b8860b',
          font: 'Assistant'
        };
      case 'ורוד מרשמלו':
        return {
          backgroundColor: '#fdf2f8',
          innerFrameColor: '#fce7f3',
          outerFrameColor: '#f9a8d4',
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

  const handleCreateTemplate = () => {
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = (templateName: string) => {
    const templateKey = `custom_template_${templateName}`;
    localStorage.setItem(templateKey, JSON.stringify(settings));
    
    // Update custom templates list
    const newTemplate = { name: templateName, settings: { ...settings } };
    setCustomTemplates(prev => [...prev, newTemplate]);
    
    setIsTemplateModalOpen(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Invoice Customization</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="order-2 lg:order-1">
          <Card className="overflow-hidden shadow-md">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">Invoice Preview</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Preview how your invoice will look to customers
              </p>
            </div>
            <InvoicePreview settings={settings} onSettingsChange={handleSettingsChange} />
          </Card>
        </div>
        
        <div className="order-1 lg:order-2">
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
      
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}
