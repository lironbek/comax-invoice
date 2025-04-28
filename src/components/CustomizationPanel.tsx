import { useState } from "react";
import { InvoiceSettings } from "./InvoiceCustomizer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, MessageSquare } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomizationPanelProps {
  settings: InvoiceSettings;
  onSettingsChange: (settings: Partial<InvoiceSettings>) => void;
  onSocialMediaChange: (platform: keyof InvoiceSettings["socialMedia"], value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export default function CustomizationPanel({
  settings,
  onSettingsChange,
  onSocialMediaChange,
  onSave,
  isSaving
}: CustomizationPanelProps) {
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [secondaryBannerFile, setSecondaryBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setBannerFile(file);
    const imageUrl = URL.createObjectURL(file);
    onSettingsChange({ bannerImage: imageUrl });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    const imageUrl = URL.createObjectURL(file);
    onSettingsChange({ logo: imageUrl });
  };

  const handleSecondaryBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSecondaryBannerFile(file);
    const imageUrl = URL.createObjectURL(file);
    onSettingsChange({ secondaryBannerImage: imageUrl });
  };

  const fontOptions = [
    { value: "Arial", label: "Arial" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Times", label: "Times New Roman" },
    { value: "Courier", label: "Courier New" },
    { value: "Georgia", label: "Georgia" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-6">
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
                onChange={handleBannerUpload}
              />
            </Button>
            <span className="text-sm text-muted-foreground">
              {bannerFile ? bannerFile.name : "No file selected"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended size: 800x150px. Max file size: 2MB
          </p>
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
                onChange={handleLogoUpload}
              />
            </Button>
            <span className="text-sm text-muted-foreground">
              {logoFile ? logoFile.name : "No file selected"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Recommended size: 200x200px. Max file size: 1MB
          </p>
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
                onChange={handleSecondaryBannerUpload}
              />
            </Button>
            <span className="text-sm text-muted-foreground">
              {secondaryBannerFile ? secondaryBannerFile.name : "No file selected"}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Colors</h3>
        
        <div className="space-y-2">
          <Label htmlFor="background-color" className="text-sm">
            Background Color
          </Label>
          <div className="flex items-center space-x-4">
            <Input
              type="color"
              id="background-color"
              value={settings.backgroundColor}
              onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={settings.backgroundColor}
              onChange={(e) => onSettingsChange({ backgroundColor: e.target.value })}
              className="w-28"
              maxLength={7}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inner-frame-color" className="text-sm">
            Inner Frame Color
          </Label>
          <div className="flex items-center space-x-4">
            <Input
              type="color"
              id="inner-frame-color"
              value={settings.innerFrameColor}
              onChange={(e) => onSettingsChange({ innerFrameColor: e.target.value })}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={settings.innerFrameColor}
              onChange={(e) => onSettingsChange({ innerFrameColor: e.target.value })}
              className="w-28"
              maxLength={7}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="outer-frame-color" className="text-sm">
            Outer Frame Color
          </Label>
          <div className="flex items-center space-x-4">
            <Input
              type="color"
              id="outer-frame-color"
              value={settings.outerFrameColor}
              onChange={(e) => onSettingsChange({ outerFrameColor: e.target.value })}
              className="w-16 h-10 p-1 cursor-pointer"
            />
            <Input
              type="text"
              value={settings.outerFrameColor}
              onChange={(e) => onSettingsChange({ outerFrameColor: e.target.value })}
              className="w-28"
              maxLength={7}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="font-select" className="font-medium">
          Font
        </Label>
        <Select 
          value={settings.font} 
          onValueChange={(value) => onSettingsChange({ font: value })}
        >
          <SelectTrigger className="w-full" id="font-select">
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span className={`font-${font.value.toLowerCase()}`}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <Button
        className="w-full"
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
