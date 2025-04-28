
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const handleSaveChanges = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      // Show success toast
    }, 1000);
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
            <InvoicePreview settings={settings} />
          </Card>
        </div>
        
        <div className="order-1 lg:order-2">
          <Card className="shadow-md">
            <Tabs defaultValue="appearance">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Customization Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Personalize how your invoice appears to customers
                </p>
                <TabsList className="mt-4">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="company">Company Details</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="appearance" className="p-4 space-y-6">
                <CustomizationPanel 
                  settings={settings} 
                  onSettingsChange={handleSettingsChange}
                  onSocialMediaChange={handleSocialMediaChange}
                  onSave={handleSaveChanges}
                  isSaving={isSaving}
                />
              </TabsContent>
              
              <TabsContent value="company" className="p-4 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="text-sm font-medium">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      className="w-full p-2 border rounded-md"
                      value={settings.companyName}
                      onChange={(e) => 
                        handleSettingsChange({ companyName: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="branchName" className="text-sm font-medium">
                      Branch Name
                    </label>
                    <input
                      id="branchName"
                      className="w-full p-2 border rounded-md"
                      value={settings.branchName}
                      onChange={(e) => 
                        handleSettingsChange({ branchName: e.target.value })
                      }
                    />
                  </div>
                  
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-md transition-colors"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
