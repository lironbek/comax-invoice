import { InvoiceSettings } from "./InvoiceCustomizer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, MessageSquare, X, ChevronDown } from "lucide-react";

interface CustomizationPanelProps {
  settings: InvoiceSettings;
  onSettingsChange: (settings: Partial<InvoiceSettings>) => void;
  onSocialMediaChange: (platform: keyof InvoiceSettings["socialMedia"], value: string) => void;
  onFileRemove: (field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function CustomizationPanel({
  settings,
  onSettingsChange,
  onSocialMediaChange,
  onFileRemove,
  onSave,
  isSaving
}: CustomizationPanelProps) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'bannerImage' | 'secondaryBannerImage' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    onSettingsChange({ [field]: imageUrl });
  };

  return (
    <div className="space-y-6 rtl-container">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="banner-upload" className="font-medium">
            Promotional Banner
          </Label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              onClick={() => document.getElementById("banner-upload")?.click()}
            >
              Upload Banner
              <input
                type="file"
                id="banner-upload"
                className="sr-only"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'bannerImage')}
              />
            </Button>
            <span className="text-sm text-muted-foreground flex-1">
              {settings.bannerImage ? 'Image uploaded' : 'No file selected'}
            </span>
            {settings.bannerImage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFileRemove('bannerImage')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Recommended size: 390x180px, max 1MB</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo-upload" className="font-medium">
            Company Logo
          </Label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              Upload Logo
              <input
                type="file"
                id="logo-upload"
                className="sr-only"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'logo')}
              />
            </Button>
            <span className="text-sm text-muted-foreground flex-1">
              {settings.logo ? 'Image uploaded' : 'No file selected'}
            </span>
            {settings.logo && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFileRemove('logo')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Recommended size: 140x140px, max 1MB</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secondary-banner-upload" className="font-medium">
            Secondary Banner
          </Label>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="relative overflow-hidden"
              onClick={() => document.getElementById("secondary-banner-upload")?.click()}
            >
              Upload Secondary Banner
              <input
                type="file"
                id="secondary-banner-upload"
                className="sr-only"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'secondaryBannerImage')}
              />
            </Button>
            <span className="text-sm text-muted-foreground flex-1">
              {settings.secondaryBannerImage ? 'Image uploaded' : 'No file selected'}
            </span>
            {settings.secondaryBannerImage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFileRemove('secondaryBannerImage')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Recommended size: 390x180px, max 1MB</p>
        </div>

        <div className="space-y-6">
          <Label className="font-medium block text-right">צבעים</Label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border rounded-md bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer"
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <Label className="text-sm font-normal">רקע</Label>
            </div>

            <div className="flex items-center justify-between p-2 border rounded-md bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.innerFrameColor}
                  onChange={(e) => onSettingsChange({ innerFrameColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer"
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <Label className="text-sm font-normal">טקסט</Label>
            </div>

            <div className="flex items-center justify-between p-2 border rounded-md bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.outerFrameColor}
                  onChange={(e) => onSettingsChange({ outerFrameColor: e.target.value })}
                  className="w-6 h-6 rounded border-0 cursor-pointer"
                />
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <Label className="text-sm font-normal">טקסט מבטא</Label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="font-medium">Social Media Links</Label>
          
          <div className="flex items-center space-x-3">
            <Facebook size={20} className="text-blue-600" />
            <Input
              placeholder="Facebook URL"
              value={settings.socialMedia.facebook}
              onChange={(e) => onSocialMediaChange("facebook", e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Instagram size={20} className="text-pink-600" />
            <Input
              placeholder="Instagram URL"
              value={settings.socialMedia.instagram}
              onChange={(e) => onSocialMediaChange("instagram", e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <MessageSquare size={20} className="text-black" />
            <Input
              placeholder="TikTok URL"
              value={settings.socialMedia.tiktok}
              onChange={(e) => onSocialMediaChange("tiktok", e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-[#34A853] hover:bg-[#2A8644] transition-colors"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
